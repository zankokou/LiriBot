require("dotenv").config();
const omdb = require("omdbapi");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const keys = require("./keys.js");
const request = require("request");

const omdbKey = keys.omdb.key;

var spotifyAPI = new Spotify(keys.spotify)
var client = new Twitter(keys.twitter);


let inputString = process.argv;
let cmd = inputString[2];

var fs = require('fs');
var userInput = ""

if (cmd === 'do-what-it-says') {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        data = data.replace(/['"]+/g, '');
        var dataArr = data.split(',');

        var command = dataArr[0];
        userInput = dataArr[1];

        switch (command) {
            case "movie-this":
                callOmdb();
                break;

            case "spotify-this-song":
                callSpotify();
                break;

            case "my-tweets":
                callTwitter();
                break;
        };
    });
}

switch (cmd) {
    case "movie-this":
        callOmdb();
        break;

    case "spotify-this-song":
        callSpotify();
        break;

    case "my-tweets":
        callTwitter();
        break;

};


//calling omdb function
function callOmdb() {

    for (i = 3; i < inputString.length; i++) {
        userInput = userInput + inputString[i] + " ";

    }
    if (userInput == "") {
        userInput = "Mr. Nobody";
    }
    console.log(userInput);
    let queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=" + omdbKey;

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            // console.log(data);
            console.log("Title: " + data.Title);
            console.log("Release Year: " + data.Year);
            console.log("IMDB Rating: " + data.imdbRating);
            var rottenTomatoes = "";
            for (var i = 0; i < data.Ratings.length; i++) {
                if (data.Ratings[i].Source == "Rotten Tomatoes") {
                    rottenTomatoes = data.Ratings[i].Value;
                }
            }
            console.log("Rotten Tomatoes: " + rottenTomatoes);
            console.log("Country of Production: " + data.Country);
            console.log("Language : " + data.Language);
            console.log("Plot Summary: " + data.Plot);
            console.log("Actors: " + data.Actors);
        }
    });
}//end of movie function

//spotify function
function callSpotify() {
    for (i = 3; i < inputString.length; i++) {
        userInput = userInput + inputString[i] + " ";
    }

    if (userInput == "") {
        userInput = "Never Gonna Give You Up";
    }
    console.log(userInput);
    spotifyAPI.search({ type: 'track', query: userInput, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data.tracks.items[0].artists[0]);
        var album = data.tracks.items[0].album.name;
        var artist = data.tracks.items[0].artists[0].name;
        var song = data.tracks.items[0].name;
        var url = data.tracks.items[0].preview_url;
        console.log('You selected the song ' + song + ' by the artist ' + artist + '\n' + 'This song is on the "' + album + '" album.' + '\nYou can find a preview to the song here: ' + '\n' + url);
    });
};//end of spotify function


//twitter call
function callTwitter() {
    var userName = "Kennygbf2017"

    client.get('statuses/user_timeline', userName, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
            for (i = 0; i < tweets.length && i < 20; i++) {
                console.log(tweets[i].text);
                console.log(tweets[i].created_at.slice(0, 20));
                console.log("")
            };
        };
    });
}//end of twitter

