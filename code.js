//declare requirements
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');



//declare variables
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//accept inputs
var input = process.argv;
var operator = input[2];
var title = input[3];

//function block
    //Spacer
    function spacer(){
        console.log("------------------------")
    };

    //Twitter
    function liriTwitter(){
        //last 20 tweets and date posted
        client.get('statuses/user_timeline', count=20, function(error, tweets, response) {
            if (!error) {
                spacer();
                console.log("Tweets");
                spacer();
                for (var i = 0; i < tweets.length; i++) {
                var tweetNum = i + 1;
                console.log(tweetNum + " - " + tweets[i].created_at + "\n" + "     " + tweets[i].text);
                spacer();
                }
            }
            });
    };
    //Spotify
    function liriSpotify(song){
        //Defualt song if input is unrecognized.
        if (!song) {
            spacer();
            console.log("Spotify: Default Value");
            spacer();
            spotify.search({ type: 'track', query: "Carry on my wayward son kansas", limit: 1}, function(err, data) {
                if (err) {
                console.log(err);
                return;
                }
                var query = data.tracks.items;
                for (var i = 0; i < query.length; i++) {
                var artist = query[i].album.artists[0].name;
                var songName = query[i].name;
                var album = query[i].album.name;
                var preview = query[i].preview_url;
                console.log("Artist(s): " + artist + "\nTitle: " + songName + "\nAlbum: " + album + "\nLink: " + preview);
                spacer();
                }
            });
            }
        //log out searched song
        else {
            spacer();
            console.log("Spotify- User Entry: " + song);
            spacer();
            spotify.search({ type: 'track', query: song, limit: 5}, function(err, data) {
                if (err) {
                console.log(err);
                return;
                }
                var query = data.tracks.items;
                for (var i = 0; i < query.length; i++) {
                var artist = query[i].album.artists[0].name;
                var songName = query[i].name;
                var album = query[i].album.name;
                var preview = query[i].preview_url;
                console.log("Artist(s): " + artist + "\nTitle: " + songName + "\nAlbum: " + album + "\nLink: " + preview);
                spacer();
                }
            });
        }
    };
    //Movies
    function liriOMDB(movie){
        //default to The Thing
        if (!movie) {
            movie = "The+Thing"
            }
            var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
            request(queryUrl, function(error, response, data) {
            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {
                var movieData = JSON.parse(data);
                spacer();
                console.log(movieData.Title )
                spacer();
                console.log(
                "\nYear of Release: " + movieData.Year +
                "\nIMDB Rating: " + movieData.Ratings[0].Value +
                "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value + 
                "\nCountry of Production: " + movieData.Country +
                "\nLanguage: " + movieData.Language +
                "\nPlot: " + movieData.Plot +
                "\nStarring: " + movieData.Actors
                );
            }
            });
        
        
    };
    //Do-What-It-Says
    function liriDoIt() {
        //run the spotify-this-song from random.txt
        fs.readFile("random.txt", "utf8", function(error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }
            liriSpotify(data);

});
        
    };

//logic block
    //twitter block
    if (operator === "my-tweets"){
        liriTwitter();
    }
    //spotify block
    else if (operator === "spotify-this-song"){
        liriSpotify(title);
    }
    //movie block
    else if (operator === "movie-this"){
        liriOMDB(title);
    }
    //Do what it says block
    else if (operator === "do-what-it-says"){
        liriDoIt();
    }
    //failure
    else {
        console.log("Invalid Operator, try again.")
    }