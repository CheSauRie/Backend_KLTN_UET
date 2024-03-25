const fs = require('fs');
const path = require('path');

function updateEnvVariable(key, value) {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, { encoding: 'utf-8' });
    let envLines = envContent.split('\n');
    const keyIndex = envLines.findIndex(line => line.startsWith(`${key}=`));
    if (keyIndex !== -1) {
        envLines[keyIndex] = `${key}=${value}`;
    } else {
        envLines.push(`${key}=${value}`);
    }
    envContent = envLines.join('\n');
    fs.writeFileSync(envPath, envContent, { encoding: 'utf-8' });
}

module.exports = {
    updateEnvVariable
}