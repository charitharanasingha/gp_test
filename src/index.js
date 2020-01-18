var compression = require('compression');
var express = require('express')
var app = express()
app.use(compression())

const { getRandomWordSync, getRandomWord } = require('word-maker');
const fs = require('fs');
const FILE = 'results.txt';
const ERROR_TEXT = `It shouldn't break anything`;

const randomWordGenerator = async (index, async = false) => {
    let textToPrint = '';
    if (index % 3 === 0) {
        textToPrint += 'Fizz';
    }
    if (index % 5 === 0) {
        textToPrint += 'Buzz';
    }
    if (textToPrint === '') {
        if (async) {
            await getRandomWord({ withErrors: true, slow: false }).then(result => {
                textToPrint = result;
            }).catch(err => {
                console.log(err);
                textToPrint = ERROR_TEXT;
            })
        } else {
            try {
                textToPrint = getRandomWordSync({ withErrors: true });
            } catch (error) {
                textToPrint = ERROR_TEXT;
            }
        }

    }
    printToFile(FILE, `${index}: ${textToPrint}\n`);
};

const printToFile = (file, text) => {
    fs.appendFileSync(file, text);
    console.log(`${file} successfully appended with ${text}`);
}

//Functions to run
function syncRun() {
    printToFile(FILE, '---Synchronus---\n\n');
    Array.from({ length: 100 }, (_, x) => randomWordGenerator(x + 1));
}

async function asyncRun() {
    printToFile(FILE, '\n\n---Asynchronus---\n\n');
    for (i = 1; i <= 100; i++) {
        await randomWordGenerator(i, true);
    }
}

syncRun();
asyncRun();