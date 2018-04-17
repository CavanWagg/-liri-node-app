require('dotenv').config();
const fs = require('fs');
// console.log(process.env.TWITTER_CONSUMER_KEY);
// const spotify = new Spotify(keys.spotify);
// // twitter
// const client = new Twitter(keys.twitter);
// request;
const request = require('request');


// OMDB request
// Store all of the arguments in an array
const nodeArgs = process.argv;

// Create an empty variable for holding the movie name
let movieName = '';

//if no argument is specified then use mr. nobody
if (process.argv[2] == undefined) {
  movieName = "mr+nobody";
} else {
  // Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (let i = 2; i < nodeArgs.length; i++) {
  if (i > 2 && i < nodeArgs.length) {
    movieName = `${movieName}+${nodeArgs[i]}`;
  } else {
    movieName += nodeArgs[i];
  }
}

}




const queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`;

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