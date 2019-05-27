const dotEnv = require('dotenv').config();
const fs = require('fs');
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const inquirer = require('inquirer');
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const request = require('request');

function tweetCall() {
	let params = {
		count: 20
	};
	client.get('statuses/user_timeline', params, function(error, tweets) {
		if (error) throw new Error;
		tweets.forEach(tweet => process.stdout.write(tweet.text + '\n'));
	});
}

function spotifyCall() {
	inquirer.prompt([
		{
			name: 'query',
			type: 'input',
			message: 'What is your song query?'
		},
		{
			name: 'artist',
			type: 'input',
			message: 'Who is the artist?'
		}
	]).then(function(response) {
		if(response.query === '') {
			response.query = 'The Sign';
			response.artist = 'Ace of Base';
		}
		spotify.request('https://api.spotify.com/v1/search?q=track:' + response.query + '%20artist:' + response.artist + '&limit=1&type=track&market=us').then(function(data) {
			const spotifyResponse = data.tracks.items[0];
			if (spotifyResponse !== undefined || null) {
				console.log('Band: ' + spotifyResponse.album.artists[0].name);
				console.log('Song: ' + spotifyResponse.name);
				console.log('Album: ' + spotifyResponse.album.name);
				console.log('Link: ' + spotifyResponse.album.external_urls.spotify);
			} else {
				process.stdout.write('No response found.');
			}
		}).catch(function(error) {
			process.stdout.write(error);
		});
	});
}

function movieCall() {
	inquirer.prompt([
		{
			name: 'query',
			type: 'input',
			message: 'What movie are you searching for?'
		}
	]).then(function(response) {
		let query = response.query;
		if(query === '') {
			query = 'Mr Nobody';
		}
		request('http://www.omdbapi.com/?apikey=trilogy&t=' + query, function(error, response, body) {
			if(error) {
				console.log(error);
			}
			console.log(JSON.parse(body).Title);
			console.log(JSON.parse(body).Year);
			console.log(JSON.parse(body).imdbRating);
			console.log(JSON.parse(body).Ratings[1].Value);
			console.log(JSON.parse(body).Country);
			console.log(JSON.parse(body).Language);
			console.log(JSON.parse(body).Plot);
			console.log(JSON.parse(body).Actors);
		});
	});
}

function randomtxtCall() {
	fs.readFile('random.txt', 'utf8', function(error, data) {
		if (error) throw new Error;
		console.log(data);
		var dataArr = data.split(',');
		spotify.request('https://api.spotify.com/v1/search?q=track:' + dataArr[1] + '&limit=1&type=track&market=us').then(function(data) {
			const spotifyResponse = data.tracks.items[0];
			console.log('Band: ' + spotifyResponse.album.artists[0].name);
			console.log('Song: ' + spotifyResponse.name);
			console.log('Album: ' + spotifyResponse.album.name);
			console.log('Link: ' + spotifyResponse.album.external_urls.spotify);
		}).catch(function(err) {
			console.log(err);
		});
	});
}

inquirer.prompt([
	{
		name: 'option',
		type: 'list',
		message: 'What would you like to do?',
		choices: ['View My Tweets', 'Spotify This Song', 'Movie This', 'Do What it Says']
	}
]).then(function(response) {
	if (response.option === 'View My Tweets') {
		tweetCall();
	}
	if (response.option === 'Spotify This Song') {
		spotifyCall();
	}
	if (response.option === 'Movie This') {
		movieCall();
	}
	if (response.option === 'Do What it Says') {
		randomtxtCall();
	}
});