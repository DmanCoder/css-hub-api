import axios from 'axios';

// Base URL
const dbURL = 'https://api.themoviedb.org/3'; // TMDb API version 3

// Axios instance: Base URL for the movie data base
const dbAPI = axios.create({
  baseURL: dbURL,
});

module.exports = { dbAPI, dbURL, axios };
