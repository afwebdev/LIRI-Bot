require("dotenv").config();

let moment = require("moment");
let keys = require("./keys.js");
let inquirer = require("inquirer");
let fs = require("fs");

let Search = require("./search.js");
let search = new Search();
let divider = "********************************";

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
				search.spotify(query, searchPrompt);
				break;
			case "concert-this":
				search.concert(query, searchPrompt);
				break;
			case "movie-this":
				search.omdb(query, searchPrompt);
				break;
			case "random":
				readFromFile();
				break;
			case "Exit":
				process.exit();
				break;
			default:
				break;
		}
		// searchPrompt();
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
						return "What would you like to do now?";
					} else {
						return "Welcome to LIRI, Multi-Entertainment Search!";
					}
				},
				choices: ["Find a Song", "Find a Concert", "Find a Movie", "Random", "Exit"]
			},
			{
				when: function(answers) {
					if (answers.option === "Exit" || answers.option === "Random") {
						return false;
					} else {
						return true;
					}
				},
				type: "input",
				name: "query",
				message: "Search for something:"
			}
		])
		.then(answers => {
			switch (answers.option) {
				case "Find a Song":
					search.spotify(answers.query, searchPrompt);
					break;
				case "Find a Concert":
					search.concert(answers.query, searchPrompt);
					break;
				case "Find a Movie":
					search.omdb(answers.query, searchPrompt);
					break;
				case "Random":
					readFromFile(searchPrompt);
					break;
				case "Exit":
					process.exit();
					break;
				default:
					break;
			}
			//
		});
};

searchPrompt();
