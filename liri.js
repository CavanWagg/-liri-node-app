require('dotenv').config();
const fs = require('fs');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');

const liriCommand = process.argv[2];
const keys = require('./key.js');


// User based authentication
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

// take in the command line arguments
const cmdArgs = process.argv;

// for loop to allow spaces in Liri command
let liriArg = '';
for (let i = 3; i < cmdArgs.length; i++) {
  liriArg += cmdArgs[i] + ' ';
}

// switch statement for all the possibilities
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
    break;
}

// if the movieThis function is called
function movieThis(movie) {
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
    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log(`Title: ${JSON.parse(body).Title}`);
      console.log(`Release Year: ${JSON.parse(body).Year}`);
      console.log(`IMDB Rating: ${JSON.parse(body).Ratings[0].Value}`);
      console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`);
      console.log(`Produced in: ${JSON.parse(body).Country}`);
      console.log(`Language: ${JSON.parse(body).Language}`);
      console.log(`Main plot: ${JSON.parse(body).Plot}`);
      console.log(`Actors: ${JSON.parse(body).Actors}`);
    }
  });
}

function myTweets() {
  const params = {
    screen_name: 'cavanNode',
    count: 20,
  };
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      tweets.forEach((element) => {
        console.log(element.text);
        console.log(element.created_at);
      });
    }
  });
}

function spotifySong(song) {
  // Create an empty variable for holding the movie name

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

    console.log(`Artists: ${JSON.stringify(data.tracks.items[0].artists[0].name)}`);
    console.log(`Song: ${JSON.stringify(data.tracks.items[0].name)}`);
    console.log(`Preview link: ${JSON.stringify(data.tracks.items[0].preview_url)}`);
    console.log(`Album: ${JSON.stringify(data.tracks.items[0].album.name)}`);
  });
}

function readText() {
  fs.readFile('random.txt', 'utf8', (error, data) => {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    // Then split it by commas (to make it more readable)
    const dataArr = data.split(',');
    const command = dataArr[0].trim();
    const param = dataArr[1].trim();

    // let dataArr[1]
    if (command === 'spotify-this-song') {
      console.log('you got it');
      spotifySong(param);
    } else if (command === 'movie-this') {
      movieThis(param);
    } else if (command === 'my-tweets') {
      myTweets();
    } else {
      console.log('I can not perform a command based on reading this txt file');
    }


    // We will then re-display the content as an array for later use.
    { console.log(dataArr); }
  });
}

function noInput() {
  console.log('I did not recognize that input, please use "movie-this", "spotify-this-song", "my-tweets", or "do-what-it-says"');
}
