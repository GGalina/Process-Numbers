const fs = require('fs');
const readline = require('readline');
const { processFile } = require('./processNumbers');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the path of the file to upload (e.g., "C:\\Users\\Smith\\Downloads\\example.txt"): ',
    async (filePath) => {
        try {
            if (fs.existsSync(filePath)) {
                await processFile(filePath);
            } else {
                console.log('File not found. Please provide a valid file path.');
            }
        } catch (error) {
            console.error('Error processing file:', error);
        } finally {
            rl.close();
        }
});





//C:\Users\Dell\Downloads\10m.txt


//C:\Users\Dell\Downloads\10.txt