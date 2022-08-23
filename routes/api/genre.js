const express = require('express');
const url = require('url');

const router = express.Router();

const { dbAPI } = require('../../api/init');
const shuffle = require('../../utils/shuffle');
const validateGenre = require('../../validations/validateGenre');

router.get('/', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const { language, page } = queryObject;

  const { errors, isValid } = validateGenre(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  const moviesEndpoint = `/discover/movie?api_key=${process.env.THE_MOVIE_DATABASE_API}&language=en-US&page=1&with_genres=16&with_keywords=210024|287501&with_text_query=death&language=${language}&page=${page}`;

  dbAPI
    .get(moviesEndpoint)
    .then((response) => {
      const { data } = response;

      const moviesWithAddedMediaType = data.results.map((movie) => ({
        ...movie,
        media_type: 'movie',
      }));

      return res.send({ results: moviesWithAddedMediaType });
    })
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results TEST', err } });
    });
});

module.exports = router;
