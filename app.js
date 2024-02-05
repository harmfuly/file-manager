const args = process.argv.slice(2);
let finished = false;

const getUserName = () => {
    const usernameArg = args.find(arg => arg.startsWith('--username='));
    if (usernameArg) {
        return usernameArg.split('=')[1];
    }
    return null;
}

const displayWelcomeMessage = () => {
    const username = getUserName();
    const currentDirectory = process.cwd();
        console.log(`Welcome to the File Manager, ${username}!`);
        console.log(`You are currently in ${currentDirectory}`);
};

const displayFinishMessage = () => {
    const username = getUserName();
    const currentDirectory = process.cwd();
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    console.log(`You were in ${currentDirectory}`);
    finished = true;
};

process.on('beforeExit', () => {
    setImmediate(() => {
        displayFinishMessage();
    });
});

process.on('exit', () => {
    displayFinishMessage();
});

displayWelcomeMessage();