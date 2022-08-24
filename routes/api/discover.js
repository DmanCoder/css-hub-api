const express = require('express');
const router = express.Router();

const url = require('url');

const { dbAPI, axios } = require('../../api/init');

// Utilities
const shuffle = require('../../utils/shuffle');

// Validators
const validateDiscover = require('../../validations/validateDiscover');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/discover
 * @param     {req, res} - Request & Response
 * @access    Public
 */
router.get('/', (req, res) => {
  // Expected params
  const queryObject = url.parse(req.url, true).query;
  const { selected_country, network_id, language, page } = queryObject;

  // Reject if expected params are not present
  const { errors, isValid } = validateDiscover(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  // Movie
  //   &language=en-US&page=1&with_genres=16&with_keywords=210024|287501&with_text_query=death&language=${language}&page=${page}
  const moviesEndpoint = `/discover/movie?api_key=${process.env.THE_MOVIE_DATABASE_API}`;
  const tvEndpoint = `/discover/tv?api_key=${process.env.THE_MOVIE_DATABASE_API}`;

  const movieApi = dbAPI.get(moviesEndpoint);
  const tvApi = dbAPI.get(tvEndpoint);

  axios
    .all([movieApi, tvApi])
    .then(
      axios.spread((...responses) => {
        const [movie, tv] = responses; // Destructure

        const combinedMedias = [...movie?.data?.results, ...tv?.data?.results];
        const shuffledMedias = shuffle({ array: combinedMedias });

        return res.send({ results: shuffledMedias });
      })
    )
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results', err } });
    });
});

module.exports = router;
