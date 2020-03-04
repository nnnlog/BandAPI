const api = new (require("../index"))("", "");
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question(api.getRedirectURI("https://nnnlog.azurewebsites.net/band/") + "\nType your code :", ans => {
	api.getToken(ans).then(d => {
		console.log(d);
		process.exit(0);
	}).catch(e => console.log(e));

});