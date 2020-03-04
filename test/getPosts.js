const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Type your access token :", token => {
	rl.question("Type band_key (optional) :", key => {
		(new (require("../index"))("", "", token.trim())).getProfile(key.trim() === "" ? null : key.trim()).then(d => {
			console.log(d);
			process.exit(0);
		}).catch(e => console.log(e));
	});
});