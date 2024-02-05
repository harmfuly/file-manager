import { homedir } from 'os';
import url from 'url';
import path from 'path';
import { spawn } from 'child_process';
import readline from 'readline';
import fs from 'fs';

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
        console.log('Type your commands below:');
};

const displayFinishMessage = () => {
        const username = getUserName();
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        console.log(`You were in ${process.cwd()}`);
        rl.close();
};

const processUserInput = async (input) => {
    try {
        if (input === '.exit') {
            displayFinishMessage();
            process.exit(0);
        } else if (input === 'up') {
            await changeDirectory('..');
        } else if (input.startsWith('cd ')) {
            await changeDirectory(input.substring(3));
        } else if (input === 'ls') {
            await listDirectory();
        } else if (input.startsWith('cat ')) {
            const filePath = input.substring(4);
            await catFile(filePath);
        } else if (input.startsWith('add ')) {
            await createEmptyFile(input.substring(4));
        } else if (input.startsWith('rn ')){
            const args = input.split(' ');
            await renameFile(args[1], args[2]);
        } else if (input.startsWith('cp ')) {
            const args = input.split(' ');
            await copyFile(args[1], args[2]);
        } else if (input.startsWith('mv ')) {
            const args = input.split(' ');
            await moveFile(args[1], args[2]);
        } else if (input.startsWith('rm ')) {
            await deleteFile(input.substring(3));
        } else {
            console.log(`You entered: ${input}`);
            rl.prompt();
        }
    } catch (error) {
        console.log(`Invalid input: ${error.message}`);
        rl.prompt();
    }
};

const changeDirectory = async (dir) => {
    const currentPath = process.cwd();
    const newPath = path.resolve(currentPath, dir);

    if (newPath.startsWith(path.parse(currentPath).root)) {
        await fs.promises.access(newPath, fs.constants.R_OK);
        process.chdir(newPath);
        console.log(`You are currently in ${process.cwd()}`);
    } else {
        console.error('Operation failed: Cannot go upper than root directory.');
    }
    rl.prompt();
};

const listDirectory = async () => {
    const currentPath = process.cwd();
    const files = await fs.promises.readdir(currentPath);
    const content = files.map((file, index) => {
        const fullPath = path.join(currentPath, file);
        const stats = fs.statSync(fullPath);
        const type = stats.isDirectory() ? 'directory' : 'file';
        return `${index}. ${file} (${type})`;
    });

    content.sort();
    console.log('(index) | Name | Type');
    console.log(content.join('\n'));

    rl.prompt();
}

const catFile = async (filePath) => {
    try {
        const fullPath = path.resolve(process.cwd(), filePath);
        const data = await fs.promises.readFile(fullPath, 'utf-8');
        console.log(`Content of ${filePath}:\n${data}`);
        rl.prompt();
    } catch (error) {
        console.log(`Error reading file: ${error.message}`);
        rl.prompt();
    }
};

const createEmptyFile = async (fileName) => {
    const fullPath = path.resolve(process.cwd(), fileName);
    await fs.promises.writeFile(fullPath, '');
    console.log(`File ${fileName} created.`);
    rl.prompt();
};

const renameFile = async (oldPath, newPath) => {
    const oldFullPath = path.resolve(process.cwd(), oldPath);
    const newFullPath = path.resolve(process.cwd(), newPath);
    await fs.promises.rename(oldFullPath, newFullPath);
    console.log(`File ${oldPath} renamed to ${newPath}.`);
    rl.prompt();
};

const copyFile = async (sourcePath, destinationPath) => {
    const sourceFullPath = path.resolve(process.cwd(), sourcePath);
    const destinationFullPath = path.resolve(process.cwd(), destinationPath);
    const sourceStream = fs.createReadStream(sourceFullPath);
    const destinationStream = fs.createWriteStream(destinationFullPath);
    sourceStream.pipe(destinationStream);
    destinationStream.on('finish', () => {
        console.log(`File ${sourcePath} copied to ${destinationPath}.`);
        rl.prompt();
    });
};

const moveFile = async (sourcePath, destinationPath) => {
    await copyFile(sourcePath, destinationPath);
    await deleteFile(sourcePath);
};

const deleteFile = async (filePath) => {
    const fullPath = path.resolve(process.cwd(), filePath);
    await fs.promises.unlink(fullPath);
    console.log(`File ${filePath} deleted.`);
    rl.prompt();
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