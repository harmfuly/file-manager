const args = process.argv.slice(2);

const getUserName = () => {
    const usernameArg = args.find(arg => arg.startsWith('--username='));
    if (usernameArg) {
        return usernameArg.split('=')[1];
    }
    return null;
}

const displayWelcomeMessage = () => {
    const username = getUserName();
    if (username) {
        console.log(`Welcome to the File Manager, ${username}!`);
    } else {
        console.log('Username not provided.');
    }
};

const displayFinishMessage = () => {
    const username = getUserName();
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
};

process.on('exit', () => {
    displayFinishMessage();
});

displayWelcomeMessage();