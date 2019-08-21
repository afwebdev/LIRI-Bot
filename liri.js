require("dotenv").config();

let moment = require("moment");
let Spotify = require("node-spotify-api");
let keys = require("./keys.js");
let inquirer = require("inquirer");
let axios = require("axios");
let fs = require("fs");

let spotify = new Spotify(keys.spotify);

const concertSearch = (query, prompt) => {
	let url = `https://rest.bandsintown.com/artists/${query}/events?app_id=codingbootcamp`;
	axios.get(url).then(data => {
		console.log(data);
		prompt(true);
	});
};

const readFromFile = () => {
	fs.readFile("./random.txt", "utf8", (err, file) => {
		if (err) {
			console.error(err);
		}
		let entry = file.replace(`"`, "").split(",");
		let type = entry[0];
		let query = entry[1];

		switch (type) {
			case "spotify-this-song":
				searchSpotify(query, searchPrompt);
				break;
			case "concert-this":
				concertSearch(query, searchPrompt);
				break;
			case "movie-this":
				searchOMDB(query, searchPrompt);
				break;
			case "RANDOM":
				readFromFile();
				break;
			default:
				break;
		}
	});
};

const searchOMDB = (query, prompt) => {
	if (query === "") {
		query = "Mr.Nobody";
	}
	let key = keys.omdbKey.key;
	let url = `http://www.omdbapi.com/?apikey=${key}&t=${query}`;
	axios
		.get(url)
		.then(response => {
			const rd = response.data;

			const { Title, Year, Plot, Country, Ratings, Language, Actors, Released } = response.data;

			console.log("********************************");
			console.log(`* Title: ${Title}`);
			console.log(`* Year: ${Year}`);
			console.log(`* Released: ${Released}`);
			console.log(`* Plot: ${Plot}`);
			console.log(`* Actors: ${Actors}`);
			console.log(`* Actors: ${Language}`);
			console.log(`* Country: ${Country}`);
			Ratings.forEach(rating => {
				console.log("* Ratings: " + rating.Source + " -> " + rating.Value);
			});
			console.log("**********************************");
			prompt(true);
		})
		.catch(err => {
			console.error(err);
		});
};

const searchPrompt = searchAgain => {
	inquirer
		.prompt([
			{
				type: "list",
				name: "option",
				message: function() {
					if (searchAgain) {
						return "What would you like to do?";
					} else {
						return "Welcome to LIRI, Multi-Entertainment Search!";
					}
				},
				choices: ["Find a Song", "Find a Concert", "Find a Movie", "RANDOM"]
			},
			{
				// when: function(answers) {
				// 	answers.option !== "RANDOM" ? true : false;
				// },
				type: "input",
				name: "query",
				message: "Search for something:"
			}
		])
		.then(answers => {
			console.log(answers.option);
			switch (answers.option) {
				case "Find a Song":
					searchSpotify(answers.query, searchPrompt);
					break;
				case "Find a Concert":
					concertSearch(answers.query, searchPrompt);
					break;
				case "Find a Movie":
					searchOMDB(answers.query, searchPrompt);
					break;
				case "RANDOM":
					readFromFile(searchPrompt);
					break;
				default:
					break;
			}
			//
		});
};

const searchSpotify = (query, prompt) => {
	spotify.search(
		{
			type: "track",
			query: query
		},
		(err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			//success,
			let title = data.tracks.items[0].name;
			let artist = data.tracks.items[0].album.artists[0].name;
			let album = data.tracks.items[0].album.name;
			//Log Track info
			console.log("********************************");
			console.log(`* Title: ${title}`);
			console.log(`* Artist: ${artist}`);
			console.log(`* Album: ${album}`);
			console.log("********************************");

			prompt(true);
		}
	);
};

searchPrompt();
