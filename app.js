import { homedir } from 'os';
import url from 'url';
import path from 'path';
import { spawn } from 'child_process' ;
import readline from 'readline';

const args = process.argv.slice(2);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getUserName = () => {
    const usernameArg = args.find(arg => arg.startsWith('--username='));
    if (usernameArg) {
        return usernameArg.split('=')[1];
    }
    return null;
}

const displayWelcomeMessage = () => {
    const username = getUserName();
        console.log(`Welcome to the File Manager, ${username}!`);
        console.log(`You are currently in ${process.cwd()}`);
        console.log('Type your commands below');
};

const displayFinishMessage = () => {
        const username = getUserName();
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        console.log(`You were in ${currentDirectory}`);
        rl.close();
};

const processUserInput = (input) => {
    if (input === '.exit') {
        displayFinishMessage();
        process.exit(0);
    } else {
        console.log(`You entered: ${input}`);
        rl.prompt();
    }
};

process.on('exit', () => {
    setImmediate(() => {
        displayFinishMessage();
    })
});

displayWelcomeMessage();
rl.prompt();

rl.on('line', (input) => {
    processUserInput(input);
});