/**
 * I am using axios version 1.1.3 because the latest version is curretly broken
 * For more info visit this open issue https://github.com/axios/axios/issues/5346
 * 
 * I am also using `require` becaue this version does not suport ES6 imports
 */ 
const axios = require('axios');

// Base URL
const dbURL = 'https://api.themoviedb.org/3'; // TMDb API version 3

// Axios instance: Base URL for the movie data base
const dbAPI = axios.create({
  baseURL: dbURL,
});

export { dbAPI, dbURL, axios };
