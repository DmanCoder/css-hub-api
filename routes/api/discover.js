const express = require('express');
const url = require('url');
const router = express.Router();

// API instance
const { dbAPI, axios } = require('../../api/init');

// Utilities
const shuffle = require('../../utils/shuffle');
const generateParams = require('../../utils/generateParams');

// Validators
const validateDiscover = require('../../validations/validateDiscover');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/discover
 * @param     {req, res} - Request & Response
 * @access    Public
 */
router.get('/', (request, response) => {
  // Params
  const queryObject = url.parse(request.url, true).query;

  // Reject if expected params are not present
  const { errors, isValid } = validateDiscover(queryObject);
  if (!isValid) {
    response.status(400);
    return response.send({ errors });
  }

  // Convert params from client to parma string
  const params = generateParams(queryObject);

  if (queryObject?.media_type === 'tv' || queryObject?.media_type === 'movie') {
    fetchSingularMediaType({ request, response, params, queryObject });
  } else {
    fetchBothMediaType({ request, response, params });
  }
});

const fetchBothMediaType = ({ request, response, params }) => {
  const moviesEndpoint = `/discover/movie?api_key=${process.env.THE_MOVIE_DATABASE_API}&${params}`;
  const tvEndpoint = `/discover/tv?api_key=${process.env.THE_MOVIE_DATABASE_API}&${params}`;

  const movieApi = dbAPI.get(moviesEndpoint);
  const tvApi = dbAPI.get(tvEndpoint);

  axios
    .all([movieApi, tvApi])
    .then(
      axios.spread((...res) => {
        const [movie, tv] = res; // Destructure

        // Append media type
        const moviesWithAddedMediaType = movie.data.results.map((movie) => ({
          ...movie,
          appended_media_type: 'movie',
        }));

        const tvShowsWithAddedMediaType = tv.data.results.map((tv) => ({
          ...tv,
          appended_media_type: 'tv',
        }));

        const combinedMedias = [...moviesWithAddedMediaType, ...tvShowsWithAddedMediaType];
        const shuffledMedias = shuffle({ array: combinedMedias });

        return response.send({ results: shuffledMedias });
      })
    )
    .catch((err) => {
      response.status(500);
      response.send({ errors: { message: 'Issues Fetching results', err } });
    });
};

const fetchSingularMediaType = ({ request, response, params, queryObject }) => {
  const moviesEndpoint = `/discover/${queryObject?.media_type}?api_key=${process.env.THE_MOVIE_DATABASE_API}&${params}`;

  dbAPI
    .get(moviesEndpoint)
    .then((res) => {
      const tvShowsWithAddedMediaType = res.data.results.map((media) => ({
        ...media,
        appended_media_type: queryObject?.media_type,
      }));

      const combinedMedias = [...tvShowsWithAddedMediaType];

      const shuffledMedias = shuffle({ array: combinedMedias });

      return response.send({ results: shuffledMedias });
    })
    .catch((err) => {
      response.status(500);
      response.send({ errors: { message: 'Issues Fetching results', err } });
    });
};

module.exports = router;
