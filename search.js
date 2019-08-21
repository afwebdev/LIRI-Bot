require("dotenv").config();
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let axios = require("axios");
let moment = require("moment");
let divider = "*********************************************************";
class Search {
	constructor(query) {
		this.query = query;
	}
}

//Spotify API Search
Search.prototype.spotify = function(query, callback) {
	console.clear();
	let spotify = new Spotify(keys.spotify);

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
			console.log(divider);
			console.log(`* Title: ${title}`);
			console.log(`* Artist: ${artist}`);
			console.log(`* Album: ${album}`);
			console.log(divider);
			callback(true);
		}
	);
};

//OMDB API Search
Search.prototype.omdb = function(query, callback) {
	console.clear();
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

			console.log(divider);
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
			console.log(divider);
			callback(true);
		})
		.catch(err => {
			console.error(err);
		});
};

//Concert Search
Search.prototype.concert = (query, callback) => {
	console.clear();

	let url = `https://rest.bandsintown.com/artists/${query}/events?app_id=codingbootcamp`;
	axios
		.get(url)
		.then(response => {
			return response.data;
		})
		.then(data => {
			let totalShows = data.length;
			console.log(divider);
			console.log(`${totalShows} results found`);
			console.log(divider + "\n");

			data.forEach(show => {
				let { name, city, datetime } = show.venue;

				console.log(divider);
				console.log(`* Venue Name: ${name}`);
				console.log(`* Venue Location: ${city}`);
				console.log(`* Venue Date: ${moment(datetime).format("MM/DD/YYY")}`);
				console.log(divider + "\n");
			});
			callback(true);
		})
		.catch(err => {
			if (err) {
				console.log(divider);
				console.log(err.response.data.message);
				console.log(divider + "\n");
				callback();
			}
		});
};

module.exports = Search;
