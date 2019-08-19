require("dotenv").config();

let moment = require("moment");
let Spotify = require("node-spotify-api");
let keys = require("./keys.js");
let inquirer = require("inquirer");
let axios = require("axios");

let spotify = new Spotify(keys.spotify);

const searchPrompt = () => {
	inquirer
		.prompt([
			{
				type: "list",
				name: "option",
				message: "Welcome to LIRI-bot, a multi-use entertainment search",
				choices: ["Find a Song", "Find a Concert", "Find a Movie", "RANDOM"]
			},
			{
				type: "input",
				name: "query",
				message: "Search for something:"
			}
		])
		.then(answers => {
			switch (answers.query) {
				case "Find a Song":
					searchSpotify(answers.query);
					break;
				case "Find a Concert":
					break;
				case "Find a Movie":
					break;
				case "RANDOM":
					break;
				default:
					break;
			}
			console.log(answers.option);
			searchSpotify(answers.query);
		});
};

const searchSpotify = query => {
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
			let title = data.tracks.items[0].name;
			let artist = data.tracks.items[0].album.artists[0].name;
			let album = data.tracks.items[0].album.name;
			//Track title
			console.log(`* Title: ${title}`);
			console.log(`* Artist: ${artist}`);
			console.log(`* Album: ${album}`);
			console.log("********************************");
		}
	);
};

searchPrompt();
