const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Type your access token :", token => {
	(new (require("../index"))("", "", token.trim())).getBands().then(d => {
		console.log(require("util").inspect(d, true, null, true));
		process.exit(0);
	}).catch(e => console.log(e));
});