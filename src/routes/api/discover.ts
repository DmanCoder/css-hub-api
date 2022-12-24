import express from 'express';
import url from 'url';

// Axios init
import { dbAPI } from '../../axios/init';
import { MEDIA_TYPE_MOVIE } from '../../constants/index';

// Utilities
import utils from '../../utils';

const router = express.Router();

/**
 * This API makes a request to TMDb API and returns the request
 * for the client to consume. In this case it, this route will return
 * all media that is a movie type.
 *
 * ROUTE - GET /api/discover/movies
 */
router.get('/movies', (req, res) => {
  const queryObj = url.parse(req.url, true).query; // Query params provided by frontend
  const params = utils.convertQueryObjectToParams(queryObj);
  const movieEndPoint = `/discover/movie?api_key=${process.env.THE_MOVIE_DATABASE_API}${params}`;

  dbAPI
    .get(movieEndPoint)
    .then((response) => {
      const { results } = response.data;
      const movieMediaWithAppendedType = results.map((media) => ({
        ...media,
        appended_media_type: MEDIA_TYPE_MOVIE,
      }));

      const shuffled = utils.shuffle(movieMediaWithAppendedType);

      return res.send({ results: shuffled });
    })
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results', err } });
    });
});

export default router;
