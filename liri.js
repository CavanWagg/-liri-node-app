// Load node modules via require
require('dotenv').config();
const fs = require('fs');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');


// reference key.js to use keys
const keys = require('./key.js');


// User based authentication
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

// take in the command line arguments
const cmdArgs = process.argv;
const liriCommand = process.argv[2];

// for loop to allow spaces in Liri command
let liriArg = '';
for (let i = 3; i < cmdArgs.length; i++) {
  liriArg += cmdArgs[i] + ' ';
}

// switch statement for all possible LiriCommands
switch (liriCommand) {
  case 'movie-this':
    movieThis(liriArg);
    break;

  case 'spotify-this-song':
    spotifySong(liriArg);
    break;

  case 'my-tweets':
    myTweets();
    break;

  case 'do-what-it-says':
    readText();
    break;

  default:
    noInput();
}

// movieThis function will retreive movie info from OMDB
function movieThis(movie) {
  // append User command to log.txt
  fs.appendFile('./log.txt', '*User Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
    if (err) throw err;
  });

  // OMDB request
  // if no argument is specified then use mr. nobody
  let search;
  if (movie === '') {
    search = 'mr+nobody';
  } else {
    search = movie;
  }
  // Replace spaces with '+' for query string
  search = search.split(' ').join('+');
  const queryUrl = `http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=trilogy`;

  request(queryUrl, (error, response, body) => {
  // If the request is successful
    if (!error && response.statusCode === 200) {
    // Parse the body of the site and recover movie information
      const movieOutput = `Title: ${JSON.parse(body).Title}
      Release Year: ${JSON.parse(body).Year}
      IMDB Rating: ${JSON.parse(body).Ratings[0].Value}
      Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}
      Produced in: ${JSON.parse(body).Country}
      Language: ${JSON.parse(body).Language}
      Main plot: ${JSON.parse(body).Plot}
      Actors: ${JSON.parse(body).Actors}`;
      // Append LIRI Response to log.txt and log output
      fs.appendFile('./log.txt', 'LIRI Response:\n' + movieOutput + '\n\n', (err) => {
        if (err) throw err;
        console.log(movieOutput);
      });
    }
  });
}
// myTweets function will retreive tweet info from a defined screen name
function myTweets() {
  // Append User Command to log.txt
  fs.appendFile('./log.txt', '*User Command: node liri.js my-tweets\n\n', (err) => {
    if (err) throw err;
  });
  // Access tweets via screen_name, limit tweet count
  const params = {
    screen_name: 'cavanNode',
    count: 20,
  };
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      // for Each tweet available, display text and time created
      tweets.forEach((element) => {
        const twitterOutput = `${element.text}
        ${element.created_at}`;
        // Append LIRI Response to log.txt and log output
        fs.appendFile('./log.txt', 'LIRI Response:\n\n' + twitterOutput, (err) => {
          if (err) throw err;
          console.log(twitterOutput);
        });
      });
    }
  });
}
// spotifySong function will retreive song info from Spotify
function spotifySong(song) {
  // Append User Command to log.txt
  fs.appendFile('./log.txt', '*User Command: node liri.js spotify-this-song ' + song + '\n\n', (err) => {
    if (err) throw err;
  });


  // if no argument is specified then use mr. nobody
  let search;
  if (song === '') {
    search = 'The Sign Ace of Base';
  } else {
    search = song;
  }
  spotify.search({ type: 'track', query: search, limit: 1 }, (err, data) => {
    if (err) {
      return console.log(`Error occurred: ${err}`);
    }
    const spotifyOutput = `Artists: ${JSON.stringify(data.tracks.items[0].artists[0].name)}
    Song: ${JSON.stringify(data.tracks.items[0].name)}
    Preview link: ${JSON.stringify(data.tracks.items[0].preview_url)}
    Album: ${JSON.stringify(data.tracks.items[0].album.name)}`;

    // Append LIRI Response to log.txt and log output
    fs.appendFile('./log.txt', 'LIRI Response:\n\n' + spotifyOutput, (err) => {
      if (err) throw err;
      console.log(spotifyOutput);
    });
  });
}
// Readtext function will read random.txt and run the function based on the text it reads
function readText() {
  // Append User Command to log.txt
  fs.appendFile('./log.txt', '*User Command: node liri.js do-what-it-says\n\n', (err) => {
    if (err) throw err;
    fs.readFile('random.txt', 'utf8', (error, data) => {
    // If the code experiences any errors it will log the error to the console.
      if (error) {
        return console.log(error);
      }
      // Then split it by commas (to make it more readable)
      const dataArr = data.split(',');
      const command = dataArr[0].trim();
      const param = dataArr[1].trim();

      //  Run functions based on reading random.txt
      if (command === 'spotify-this-song') {
        spotifySong(param);
      } else if (command === 'movie-this') {
        movieThis(param);
      } else if (command === 'my-tweets') {
        myTweets();
      } else {
        console.log('I can not perform a command based on reading this txt file');
      }
    });
  });
}
// default function for unrecognizable command
function noInput() {
  const noInputString = `I did not recognize that input please choose one of the following commands:
  my-tweets
  movie-this
  spotify-this-song
  do-what-it-says`;
  console.log(noInputString);
}

