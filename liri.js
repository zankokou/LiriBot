require("dotenv").config();
const omdb = require("omdbapi");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const keys = require("./keys.js");
const request = require("request");

const omdbKey = keys.omdb.key;

var spotifyAPI = new Spotify(keys.spotify)
// var client = new Twitter(keys.twitter);
// console.log(spotifyAPI)

let inputString = process.argv;
let cmd = inputString[2];

switch (cmd) {
    case "movie-this":
        callOmdb();
        break;

    case "spotify-this-song":
        callSpotify();
        break;
};


//calling omdb function
function callOmdb() {
    var movieName = ""
    for (i = 3; i < inputString.length; i++) {
        movieName = movieName + inputString[i] + " ";

    }
    if (movieName == "") {
        movieName = "Mr. Nobody";
    }
    console.log(movieName);
    let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + omdbKey;

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


    // var songName = ""
    // for (i = 3; i < inputString.length; i++) {
    //     songName = songName + inputString[i] + " ";
    // }
    // console.log(songName);
    spotifyAPI.search({ type: 'track', query: 'Alone', limit: 1}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        // console.log(data.tracks.items[0].artists[0]);
      var album = data.tracks.items[0].album.name;
      var artist = data.tracks.items[0].artists[0].name;
      var song = data.tracks.items[0].name;
      var url = data.tracks.items[0].preview_url;
      console.log('You selected the song ' + song + ' by the artist ' + artist + '\n' + 'This song is on the "' + album + '" album.' + '\nYou can find a preview to the song here: ' + '\n' + url);
    }); 
};//end of spotify function

callSpotify();