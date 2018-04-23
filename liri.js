var dotEnv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function tweetCall() {
    console.log('Tweet Call Success');
}

function spotifyCall() {
    console.log('Spotify Call Success');
}

function movieCall() {
    console.log('Movie Call Success');
}

function randomtxtCall() {
    console.log('Text Call Success');
}

inquirer.prompt([
    {
        name: 'option',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View My Tweets', 'Spotify This Song', 'Movie This', 'Do What it Says']
    },
    {
        name: 'query',
        type: 'input',
        message: 'What is your query?',
    }
]).then(function(response) {
    if (response.option === 'View My Tweets') {
        tweetCall(response.query);
    }
    if (response.option === 'Spotify This Song') {
        spotifyCall(response.query);
    }
    if (response.option === 'Movie This') {
        movieCall(response.query);
    }
    if (response.option === 'Do What it Says') {
        randomtxtCall(response.query);
    }
});