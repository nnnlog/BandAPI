const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Type your access token :", token => {
	rl.question("Type band_key :", key => {
		rl.question("Type post content :", content => {
			rl.question("Type do_push (0/1) :", do_push => {
				(new (require("../src"))("", "", token.trim())).writePost(
						key.trim(),
						content.trim(),
						!!+do_push
				).then(d => {
					console.log(require("util").inspect(d, true, null, true));
				}).catch(e => console.log(e)).finally(() => process.exit(0));
			});
		});
	});
});