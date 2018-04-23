var dotEnv = require("dotenv").config();
var fs = require('fs');
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var request = require("request");

function tweetCall() {
    console.log('Tweet Call Success');
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
            response.artist = 'Ace of Base'
        };
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
    })
}

function movieCall() {
    console.log('Movie Call Success');
}

function randomtxtCall() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        var dataArr = data.split(",");
        spotify.request('https://api.spotify.com/v1/search?q=track:' + dataArr[1] + '&limit=1&type=track&market=us').then(function(data) {
            spotifyResponse = data;
            console.log('Band: ' + spotifyResponse.tracks.items[0].album.artists[0].name);
            console.log('Song: ' + spotifyResponse.tracks.items[0].name);
            console.log('Album: ' + spotifyResponse.tracks.items[0].album.name);
            console.log('Link: ' + spotifyResponse.tracks.items[0].album.external_urls.spotify);
        }).catch(function(err) {
            console.log(err);
        });
    })
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