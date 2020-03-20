const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Type your access token :", token => {
	rl.question("Type band_key :", key => {
		rl.question("Type after of next_paging (nullable) :", after => {
			(new (require("../src"))("", "", token.trim())).getAlbums(key.trim() === "" ? null : key.trim(), after.trim() === "" ? null : after.trim()).then(d => {
				console.log(require("util").inspect(d, true, null, true));
			}).catch(e => console.log(e)).finally(() => process.exit(0));
		});
	});
});