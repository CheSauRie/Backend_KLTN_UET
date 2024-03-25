const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter")
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { Document } = require("langchain/document");
const fs = require('fs/promises');
const { createClient } = require("@supabase/supabase-js");
const { SupabaseVectorStore } = require("@langchain/community/vectorstores/supabase");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai")
const { PromptTemplate } = require("langchain/prompts")
const { StringOutputParser } = require("langchain/schema/output_parser")
const { RunnablePassthrough, RunnableSequence } = require("langchain/schema/runnable");
const { Chat, Message } = require('../models');
require('dotenv').config()

/**
 * Các hàm dùng cho CRD các bảng Chat, Message
 */
// Lấy danh sách đoạn chat từ người dùng
const getChat = async (req, res) => {
    try {
        const { id } = req.user; // decoded token lấy được user_id
        const chats = await Chat.findAll({
            where: { user_id: id }
        });
        if (chats.length > 0) {
            res.status(200).json(chats);
        } else {
            res.status(404).json({ message: 'No chats found for this user.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Thêm đoạn chat input: user_id, question được xử lý về standalone_question, ouput lưu vào csdl
const createChat = async (req, res) => {
    try {
        const { id } = req.user; // decoded token lấy được user_id
        const { question } = req.body;
        /**
         * Thêm code chỗ này đưa question về dạng summary
         */
        const response = await summaryQuestion(question)
        const summary = response.content;
        const newChat = await Chat.create({ user_id: id, summary: summary });
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// xóa đoạn chat: input:user_id, chat_id
const deleteChat = async (req, res) => {
    try {
        const { id } = req.user; // decoded token lấy được user_id
        const { chat_id } = req.query;

        await Chat.destroy({
            where: {
                chat_id: chat_id,
                user_id: id
            },
        });
        await Message.destroy({
            where: {
                chat_id: chat_id,
            },
        });
        res.status(200).send("xóa thành công");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Lấy cuộc trò chuyện tương ứng: input chat_id, có thể thêm user_id để đảm bảo an toàn, lấy toàn bộ đoạn chat
const getDetailMessage = async (req, res) => {
    try {
        const { chat_id } = req.query;
        const messages = await Message.findAll({
            where: { chat_id: chat_id },
        });
        if (messages.length > 0) {
            res.status(200).json(messages);
        } else {
            res.status(404).json({ message: 'No chats found for this user.' });
        }
        //return messages;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Lấy lịch sử đoạn chat cho vào prompt, lấy 5 đoạn gần nhất không phải controller
const getMessageHistory = async (chat_id) => {
    try {
        const messages = await Message.findAll({
            where: { chat_id: chat_id },
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        if (messages.length > 0) {
            return messages;
        } else {
            console.log("No chats found for this user.");
        }
        return messages;
    } catch (error) {
        console.log(error);
    }
}

//Tạo message: đầu vào là question => tạo answer => lưu answer trong csdl
const createMessage = async (req, res) => {
    try {
        const { chat_id, question } = req.body;
        // Đổi tham số hàm responeAI thành question
        const messages = await getMessageHistory(chat_id);
        /**
         * Đưa về summary question(tức là standalone question) rồi mới lưu vào database
         */
        const response = await summaryQuestion(question)
        const summary = response.content;
        // Format lịch sử cuộc trò chuyện
        const convHistory = messages.map(msg => {
            return `Human: ${msg.question}
                    AI: ${msg.answer}`
        })
        // Tạo Answer từ hàm response AI
        const answer = await responseAI(question, convHistory);
        // Lưu vào trong db
        const newMessage = await Message.create({ chat_id: chat_id, question: question, answer: answer, summary: summary });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


/*
* Các hàm dùng cho phản hồi của AI
*/

// const logOutput = async () => {
//     const loader = new PDFLoader('../pdf/FTU.pdf');
//     const docs = await loader.load();
//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 10,
//         chunkOverlap: 1,
//     });
//     const docOutput = await splitter.splitDocuments([
//         new Document({ pageContent: docs }),
//     ]);
//     console.log(docOutput);
// }
// logOutput()


// Hàm này chạy sau khi có đủ data.
const uploadToSupabase = async () => {
    try {
        const text = await fs.readFile('E:\\KLTN\\Backend\\pdf\\FTU.txt', 'utf8');

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
            separators: ['\n\n', '\n', ' ', ''] //có thể là dấu ##
        });

        const output = await splitter.createDocuments([text]);

        const sbApiKey = process.env.SUPABASE_API_KEY
        const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
        const openAIApiKey = process.env.OPENAI_API_KEY

        const client = createClient(sbUrl, sbApiKey)

        await SupabaseVectorStore.fromDocuments(
            output,
            new OpenAIEmbeddings({
                openAIApiKey
            }),
            {
                client,
                tableName: 'documents',
            }
        )
    } catch (error) {
        console.log(error);
    }
}
//Tạo bộ truy xuất
const createRetrieval = () => {
    const sbApiKey = process.env.SUPABASE_API_KEY
    const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
    const openAIApiKey = process.env.OPENAI_API_KEY
    const client = createClient(sbUrl, sbApiKey)
    const embeddings = new OpenAIEmbeddings({ openAIApiKey })
    const vectorStore = new SupabaseVectorStore(embeddings, {
        client,
        tableName: "documents",
        queryName: 'match_documents'
    })

    const retriever = vectorStore.asRetriever()
    return retriever
}
//Kết hợp tài liệu
const combineDocuments = (docs) => {
    return docs.map((doc) => doc.pageContent).join('\n\n')
}
//Định dạng lịch sử 
const formatConvHistory = (messages) => {
    return messages.map((message, i) => {
        if (i % 2 === 0) {
            return `Human: ${message.question}`
        } else {
            return `AI: ${message.answer}`
        }
    }).join('\n')
}
//Tạo phản hồi AI
const responseAI = async (question, convHistory) => {
    try {
        const openAIApiKey = process.env.OPENAI_API_KEY
        const llm = new ChatOpenAI({ openAIApiKey, modelName: "gpt-4-1106-preview" })
        const retriever = createRetrieval()
        const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question and translate into Vietnamese.
        conversation history: {conv_history}
        question: {question} 
        standalone question:
    `
        const answerTemplate = `As a highly knowledgeable and experienced college admissions counselor, your goal is to provide guidance and support to high school students navigating the college admissions process. You will answer their questions, address their concerns, and offer expert advice tailored to their specific needs and circumstances. To receive questions or concerns from high school students, they will provide them in Vietnamese. You are to reply with detailed and informative answers based on context provided and the conversation history in Vietnamese without processing the original question or concern.
        Try to find the answer in the context. If the answer is not given in the context, use all of your training or conversation history to come up with an answer.
        It's more important to be accurate than complete. If you can't give a reliable answer and the question or concern is not related to your field, please say 'I don't know.'
        Translate the answer to Vietnamese
        Context: {context}
        Conversation history: {conv_history}
        Question: {question}
        answer:
    `
        const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)
        const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser)
        const retrieverChain = RunnableSequence.from([
            prevResult => prevResult.standalone_question,
            retriever,
            combineDocuments
        ])
        const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser)

        const chain = RunnableSequence.from([
            {
                standalone_question: standaloneQuestionChain,
                original_input: new RunnablePassthrough()
            },
            {
                context: retrieverChain,
                question: ({ original_input }) => original_input.question,
                conv_history: ({ original_input }) => original_input.conv_history
            },
            answerChain
        ])
        const response = await chain.invoke({
            question: question,
            conv_history: convHistory
        })
        return response;
    } catch (error) {
        console.log(error);
    }
}
//Đưa câu hỏi về dạng standalone
const summaryQuestion = async (question) => {
    try {
        const openAIApiKey = process.env.OPENAI_API_KEY

        const llm = new ChatOpenAI({ openAIApiKey, modelName: "gpt-4-1106-preview" })
        // A string holding the phrasing of the prompt
        const standaloneQuestionTemplate = `Given a question, convert the question to a standalone question, only give the standalone question in Vietnamese, 
        do not repeat the standalone question
        question: {question} 
        `
        // A prompt created using PromptTemplate and the fromTemplate method
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

        //Take the standaloneQuestionPrompt and PIPE the model
        const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm)

        // Await the response when you invoke the chain
        const response = await standaloneQuestionChain.invoke({
            question: question
        })

        return response;
    } catch (error) {
        console.log(error);
    }
}

//Prompt 
// When receiving questions about college admissions from high school students, utilize the full breadth of knowledge and experience you've gained from your training data to provide the most accurate and helpful answers possible. 
// Based on the provided context and conversation history, find the best answer or solution for each specific case. 
// When specific information is not available in the question or within your data, apply general principles and experience in admissions counseling to offer advice or solutions that could be applied. 
// If a question is beyond your capabilities or requires updated information you do not possess, describe the next steps or reliable sources of information the user can seek for more details. 
// Ensure all responses are accurately translated into Vietnamese to meet the user's needs.



module.exports = {
    responseAI,
    getChat,
    createChat,
    deleteChat,
    getDetailMessage,
    createMessage,
    summaryQuestion
}


// When receiving questions about college admissions from high school students, utilize the full breadth of knowledge and experience you've gained from your training data to provide the most accurate and helpful answers possible.
//         Based on the provided context and conversation history, find the best answer or solution for each specific case.
//         When specific information is not available in the question or within your data, apply general principles and experience in admissions counseling to offer advice or solutions that could be applied.
//         If a question is beyond your capabilities or requires updated information you do not possess, describe the next steps or reliable sources of information the user can seek for more details.
//         Context: {context}
//         Conversation history: {conv_history}
//         Question: {question}
//         answer:

// const answerTemplate = `As a highly knowledgeable and experienced college admissions counselor, your primary objective is to guide and support high school students through the complexities of the college admissions process. Your role involves responding to their inquiries, addressing their concerns, and providing expert advice that is specifically tailored to their unique needs and circumstances. Despite receiving questions or concerns in Vietnamese, your responses must be crafted in Vietnamese, offering detailed and informative answers that draw upon the provided context and the conversation history. Here's how to optimize your approach:

//         1. **Contextual Understanding**: Always start by thoroughly analyzing the provided context and conversation history. This will help you grasp the nuances of each student's situation and tailor your advice accordingly.
        
//         2. **Leverage Your Training Data**: Utilize the breadth of knowledge and insights you've gained from your extensive training data to inform your responses. This includes drawing on relevant examples, statistics, and case studies that can provide students with a clearer understanding of the admissions landscape.
        
//         3. **Precision Over Completeness**: Aim for accuracy in your responses. It's better to provide a precise and reliable answer to the part of the question you are confident about than to cover every aspect with less certainty. If a question falls outside your area of expertise or requires updated information that you do not possess, it's acceptable to acknowledge this by saying 'I don't know.'
        
//         4. **Translation**: Ensure that your answers are translated into Vietnamese, maintaining the integrity and nuance of the original response.
        
//         5. **Engagement and Empathy**: Remember to engage with the students' concerns empathetically, acknowledging the stress and uncertainty that can accompany the college admissions process. Your responses should not only be informative but also supportive and encouraging.
        
//         By following these guidelines, you will be better equipped to provide high school students with the guidance they need, leveraging the full capabilities of your training data and ensuring that your advice is both relevant and impactful.
        
//         Context: {context}
//         Conversation history: {conv_history}
//         Question: {question}
//         Answer:
//     `


// As a highly knowledgeable and experienced college admissions counselor, your goal is to provide guidance and support to high school students navigating the college admissions process. You will answer their questions, address their concerns, and offer expert advice tailored to their specific needs and circumstances. To receive questions or concerns from high school students, they will provide them in Vietnamese. You are to reply with detailed and informative answers based on context provided and the conversation history in Vietnamese without processing the original question or concern.
//         Try to find the answer in the context. If the answer is not given in the context, use all of your training and conversation history to come up with an answer.
//         It's more important to be accurate than complete. If you can't give a reliable answer and the question or concern is not related to your field, please say 'I don't know.'
//         Translate the answer to Vietnamese
//         Context: {context}
//         Conversation history: {conv_history}
//         Question: {question}
//         answer: