require("dotenv").config();
var keys = require("./keys.js");

//npm installs
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);

//Call function
userInput();

//User determines search criteria
function userInput() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Search for songs, concerts, or movies?",
      choices: [
        "Find songs",
        "Find concerts",
        "Find movies",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Find songs":
          input(songSearch);
          break;

        case "Find concerts":
          input(concertSearch);
          break;

        case "Find movies":
          input(movieSearch);
          break;

        case "Exit":
          process.exit();
          break;
      }
    });
}

function input(callback) {
  inquirer.prompt([{
    type: "input",
    name: "query",
    message: "What do you want to search?"
  }]).then((input) => {
    callback(input.query)
  })
}
function songSearch(query) {
  spotify.search({ type: 'track', query, limit: 5 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    for (var i = 0; i < data.tracks.items.length; i++) {
      //console.log(data.tracks.items[i]);
      console.log("Track Name: " + data.tracks.items[i].name);
      console.log("Album Name: " + data.tracks.items[i].album.name);
      console.log("Artist: " + data.tracks.items[i].artists[0].name);
      console.log("Spotify Link: " + data.tracks.items[i].external_urls.spotify);
      console.log("----------------------------");
    }
  });
};

function concertSearch(query) {
  var newQuery = query.replace(" ", "+");
  var queryUrl = "https://rest.bandsintown.com/artists/" + newQuery + "/events?app_id=codingbootcamp";
  axios.get(queryUrl).then(function (response) {
    //console.log(response.data);
    for (var i = 0; i < response.data.length; i++) {
      console.log("Venue Name: " + response.data[i].venue.name);
      console.log("Location: " + response.data[i].venue.city);
      console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
      console.log("----------------------------");
    }
  }).catch(function (err) {
    console.log(err);
  })
}

function movieSearch(query) {
  var newQuery = query.replace(" ", "+");
  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + newQuery + "&y=&plot=short&apikey=trilogy";
  axios.get(queryUrl).then(function (response) {
    //console.log(response);
    console.log("Title: " + response.data.Title);
    console.log("Year: " + response.data.Year);
    console.log("Language: " + response.data.Language);
    console.log("Country: " + response.data.Country);
    console.log("Actors: " + response.data.Actors);
    console.log("Plot: " + response.data.Plot);
    console.log("IMDB: " + response.data.imdbRating);
    console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
    console.log("----------------------------");
  }).catch(function (err) {
    console.log(err);
  });
}


// This line is just to help us debug against the actual URL.
//console.log(queryUrl);

/*axios.get(queryUrl).then(
  function (response) {
    console.log("Title: " + response.data.Title);
    console.log("Release Year: " + response.data.Year);
    console.log("Rating: " + response.data.Rating);
  }
);*/