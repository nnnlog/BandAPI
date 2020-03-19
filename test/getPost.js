const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Type your access token :", token => {
	rl.question("Type band_key :", key => {
		rl.question("Type post_key :", post => {
			(new (require("../index"))("", "", token.trim())).getPost(key.trim() === "" ? null : key.trim(), post.trim() === "" ? null : post.trim()).then(d => {
				console.log(require("util").inspect(d, true, null, true));
			}).catch(e => console.log(e)).finally(() => process.exit(0));
		});
	});
});