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

  const moviesEndpoint = `/movie/upcoming?api_key=${process.env.THE_MOVIE_DATABASE_API}&language=${language}&page=${page}`;
  const tvShowsEndpoint = `/tv/latest?api_key=${process.env.THE_MOVIE_DATABASE_API}&language=${language}&page=${page}`;

  const moviesApiRequest = dbAPI.get(moviesEndpoint);
  const tvShowsRequest = dbAPI.get(tvShowsEndpoint);

  axios
    .all([moviesApiRequest, tvShowsRequest])
    .then(
      axios.spread((...responses) => {
        const [movies, tvShows] = responses;

        const moviesWithAddedMediaType = movies.data.results.map((movie) => ({
          ...movie,
          appended_media_type: 'movie',
        }));

        return res.send({ results: moviesWithAddedMediaType });
      })
    )
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results TEST', err } });
    });
});

module.exports = router;
