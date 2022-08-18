const express = require('express');
const url = require('url');

const router = express.Router();

const { dbAPI, axios } = require('../../api/init');
const shuffle = require('../../utils/shuffle');
const validateUpcoming = require('../../validations/validateUpcoming');

router.get('/', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const { selected_country, network_id, language, page } = queryObject;

  const { errors, isValid } = validateUpcoming(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  let networkIdParam = `&with_networks=${network_id}`;
  if (network_id === '-1') networkIdParam = '';

  const moviesEndpoint = `/movie/upcoming?api_key=${process.env.THE_MOVIE_DATABASE_API}&watch_region=${selected_country}&with_watch_monetization_types=flatrate&with_origin_country=${selected_country}${networkIdParam}&language=${language}&page=${page}`;

  dbAPI
    .get(moviesEndpoint)
    .then((response) => {
      const { data } = response;

      const moviesWithAddedMediaType = data.results.map((movie) => ({
        ...movie,
        appended_media_type: 'movie',
      }));

      return res.send({ results: moviesWithAddedMediaType });
    })
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results TEST', err } });
    });
});

module.exports = router;
