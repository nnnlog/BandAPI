const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Type your access token :", token => {
	rl.question("Type band_key :", key => {
		(new (require("../src"))("", "", token.trim())).hasPermissions(key.trim() === "" ? null : key.trim(), {commenting: false, contents_deletion: false, posting: true}).then(d => {
			console.log(require("util").inspect(d, true, null, true));
		}).catch(e => console.log(e)).finally(() => process.exit(0));
	});
});