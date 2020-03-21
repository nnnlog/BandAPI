const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Type your access token :", token => {
	rl.question("Type band_key :", key => {
		rl.question("Type post_key :", post => {
			rl.question("Type after of next_paging (nullable) :", after => {
				(new (require("../src"))("", "", token.trim())).getComments(
						key.trim(),
						post.trim(),
						true,
						after.trim() === "" ? null : after.trim()
				).then(d => {
					console.log(require("util").inspect(d, true, null, true));
				}).catch(e => console.log(e)).finally(() => process.exit(0));
			});
		});
	});
});