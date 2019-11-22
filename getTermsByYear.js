const https = require('https');
const fs = require('fs');


let start = 2000,
	end = 2017,
	outputFilePath = __dirname + '/terms/';

initYear(start, end);

function initYear(start, end) {
	for (let i = start; i <= end; i++) {
		setTimeout(() => {
			let url = 'https://api.oyez.org/cases?filter=term:' + i + '&labels=true&page=0&per_page=0',
				outputFile = outputFilePath + 'all.json';
			getTerm(url, outputFile);
		}, (i - start) * 10000);
	}
}

function getTerm(url, outputFile) {
	https.get(url, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		})
		res.on('end', () => {
			let terms = JSON.parse(data);
			terms.forEach((item, i) => {
				fs.writeFileSync(outputFile, ',\n' + JSON.stringify(item, null, '\t'), { flag: 'a' });
			});

		})
	}).on('error', (e) => {
		console.log(e)
	})
}