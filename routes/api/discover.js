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
router.get('/', (req, res) => {
  // Params
  const queryObject = url.parse(req.url, true).query;

  // Reject if expected params are not present
  const { errors, isValid } = validateDiscover(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  // Convert params from client to parma string
  const params = generateParams(queryObject);

  if (params?.media_type === 'tv' || params?.media_type === 'movie') {
    fetchSingularMediaType({ req, res, params });
  } else {
    fetchBothMediaType({ req, res, params });
  }
});

const fetchBothMediaType = ({ req, res, params }) => {
  // Movie
  const moviesEndpoint = `/discover/movie?api_key=${process.env.THE_MOVIE_DATABASE_API}&${params}`;
  const tvEndpoint = `/discover/tv?api_key=${process.env.THE_MOVIE_DATABASE_API}&${params}`;

  const movieApi = dbAPI.get(moviesEndpoint);
  const tvApi = dbAPI.get(tvEndpoint);

  axios
    .all([movieApi, tvApi])
    .then(
      axios.spread((...responses) => {
        const [movie, tv] = responses; // Destructure

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

        return res.send({ results: shuffledMedias });
      })
    )
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results', err } });
    });
};

const fetchSingularMediaType = ({ req, res, params }) => {
  const moviesEndpoint = `/discover/${params?.media_type}?api_key=${process.env.THE_MOVIE_DATABASE_API}&${params}`;

  dbAPI
    .get(moviesEndpoint)
    .then((res) => {
      const tvShowsWithAddedMediaType = res.data.results.map((media) => ({
        ...media,
        appended_media_type: params?.media_type,
      }));

      const combinedMedias = [...moviesWithAddedMediaType, ...tvShowsWithAddedMediaType];

      const shuffledMedias = shuffle({ array: combinedMedias });

      return res.send({ results: shuffledMedias });
    })
    .catch((err) => {
      return res.send({ results: [], err });
    });
};

module.exports = router;
