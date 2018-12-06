var dotEnv = require('dotenv').config();
var fs = require('fs');
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var request = require('request');

function tweetCall() {
	console.log('Tweet Call Success');
	let params = {
		count: 20
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(error) {
			console.log(error);
		}
        var tweetsArr = tweets;
		tweetsArr.forEach(element => {
			console.log(element.text);
		});
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
        console.log('Spotify Call Success');
		spotify.request('https://api.spotify.com/v1/search?q=track:' + response.query + '%20artist:' + response.artist + '&limit=1&type=track&market=us').then(function(data) {
			spotifyResponse = data;
			console.log('Band: ' + spotifyResponse.tracks.items[0].album.artists[0].name);
			console.log('Song: ' + spotifyResponse.tracks.items[0].name);
			console.log('Album: ' + spotifyResponse.tracks.items[0].album.name);
			console.log('Link: ' + spotifyResponse.tracks.items[0].album.external_urls.spotify);
		}).catch(function(err) {
			console.log(err);
		});
	});
}

function movieCall() {
	console.log('Movie Call Success');
	inquirer.prompt([
		{
			name: 'query',
			type: 'input',
			message: 'What movie are you searching for?'
		}
	]).then(function(response) {
		query = response.query;
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
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		console.log(data);
		var dataArr = data.split(',');
		spotify.request('https://api.spotify.com/v1/search?q=track:' + dataArr[1] + '&limit=1&type=track&market=us').then(function(data) {
			spotifyResponse = data;
			console.log('Band: ' + spotifyResponse.tracks.items[0].album.artists[0].name);
			console.log('Song: ' + spotifyResponse.tracks.items[0].name);
			console.log('Album: ' + spotifyResponse.tracks.items[0].album.name);
			console.log('Link: ' + spotifyResponse.tracks.items[0].album.external_urls.spotify);
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