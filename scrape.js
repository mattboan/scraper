const axios = require('axios');
const fs = require('fs');
const colors = require('colors');
const Scraper = require('images-scraper');

//Usage: node scraper <keyword> <amount> <download path>

const args = process.argv.slice(2);

//Test to see if all the arguments are there | needs refactoring (needs all arguments to work)
if (args.length != 3) {
	console.log("Invalid usage. Usage: node scraper <keyword> <amount> <download path>");
	return;
}

//Parse the arguments | needs refactoring (needs all arguments to work)
const keyword = args[0];
const amount = args[1];
const downloadPath = args[2];

//Create new file directory
if (!fs.existsSync(downloadPath))
	//fs.mkdirSync(downloadPath);
	fs.mkdir(downloadPath, {recursive: true}, err => {})

//Create a new scraper
const google = new Scraper({
	puppeteer: {
		headless: false,
	}
});

//Download the image
const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
);

//Scrape using the scrapper then download every url
(async () => {
	const results = await google.scrape(keyword, amount);
	console.log("Got " + results.length + " results.");
	for(var i = 0; i < results.length; i++) {
		var obj = results[i];

		try {
			let example_image_1 = await download_image(obj.url, downloadPath + keyword + i);
			console.log("Done Downloading: ".green + obj.url);
		} catch (err) {
			console.log("Error: " + err.message);
		}

		console.log(obj.url);

	}
	//console.log( results);
})();
