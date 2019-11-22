const https = require('https');
const fs = require('fs');

//oral_argument_audio
let year = 2016,
	inputFile = __dirname + '/details/audio.json',
	outputFilePath = __dirname + '/data/';
readTerms();

function readTerms() {
	let terms = JSON.parse('[' + fs.readFileSync(inputFile, 'utf-8') + ']');
	terms.forEach((item, i) => {
		setTimeout(() => {
			let url = item;
			getTxtAudio(url)
		}, i * 6000);
	});
}
//let url = "https://api.oyez.org/case_media/oral_argument_audio/22757"
//getTxtAudio(url)
function getTxtAudio(url) {
	https.get(url, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		})
		res.on('end', () => {
			let term = JSON.parse(data)
			if (term.media_file === null) {
				console.log("mp3 not exist!");
			} else {
				console.log(url);
				fs.writeFileSync(outputFilePath + 'mp3.list', term.media_file[0].href + '\n', {flag: 'a'});

				let name = term.media_file[0].href.split('/')[7];
				fs.writeFileSync(outputFilePath + 'json/' + name + '.json', JSON.stringify(term, null, '\t'), {flag: 'a'});
				if (term.transcript !== null) {
					term.transcript.sections.forEach((item, i) => {
						item.turns.forEach((item, i) => {
							item.text_blocks.forEach((item, i) => {
								fs.writeFileSync(outputFilePath + 'txt/' + name + '.txt', item.text + '\n', {flag: 'a'});
							})
						})
					})
				} else {
					console.log("transcript doesn't exist!");
				}			
			}
		})		
	}).on('error', (e) => {
		console.log(e)
	})
}
