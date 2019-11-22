const https = require('https');
const fs = require('fs');

//oral_argument_audio
let outputFilePath = __dirname + '/details/',
	outputFile = outputFilePath + 'audio.json';
readTerms();

function readTerms() {
	let terms = JSON.parse('[' + fs.readFileSync(__dirname + '/terms/all.json', 'utf-8') + ']');
	terms.forEach((item, i) => {
		setTimeout(() => {
			let url = item.href;
			getTermDetail(url, outputFile)
		}, i * 3000);
	});
}

function getTermDetail(url, outputFile) {
	https.get(url, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		})
		res.on('end', () => {
			let term = JSON.parse(data),
				str = '';
			if (term.oral_argument_audio === null) {
			} else {
				str += ',\n' + term.oral_argument_audio[0].href;
				fs.writeFileSync(outputFile, str, { flag: 'a' });
			}
		})
	}).on('error', (e) => {
		console.log(e)
	})
}