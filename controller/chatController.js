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
require('dotenv').config({ path: '../.env' }) // Thay '../.env' bằng đường dẫn đúng đến file .env của bạn

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

const combineDocuments = (docs) => {
    return docs.map((doc) => doc.pageContent).join('\n\n')
}

const formatConvHistory = (messages) => {
    return messages.map((message, i) => {
        if (i % 2 === 0) {
            return `Human: ${message}`
        } else {
            return `AI: ${message}`
        }
    }).join('\n')
}
const convHistory = []
const responseAI = async (req, res) => {
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
        Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible.
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
        const { question } = req.body
        const response = await chain.invoke({
            question: question,
            conv_history: formatConvHistory(convHistory)
        })

        convHistory.push(question)
        convHistory.push(response)

        res.status(201).send(response)
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    responseAI
}
