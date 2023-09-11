import express from 'express';
import url from 'url';

// Axios init
import { dbAPI } from '../../axios/init';

// Utilities
import utils from '../../utils';

// Validate
import validate from '../../validations';

const router = express.Router();

/**
 * This API makes a request to TMDb API and returns the request
 * for the client to consume. In this case, this route will return
 * all media for both movie & tv types.
 *
 * ROUTE - GET /api/discover/movies || /api/discover/tv
 */
router.get('/', (req, res) => {
  const queryObj = url.parse(req.url, true).query; // Query params provided by frontend
  const params = utils.convertQueryObjectToParams(queryObj);
  // const endPoint = `/discover/${queryObj.media_type}?api_key=${process.env.THE_MOVIE_DATABASE_API}${params}`;
  const endPoint = `/discover/tv?api_key=${process.env.THE_MOVIE_DATABASE_API}${params}`;

  // Reject if expected params are not present
  const { errors, isValid } = validate.discover({ ...queryObj });
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  dbAPI
    .get(endPoint)
    .then((response) => {
      const { results } = response.data;
      const meediaWithAppendedType = results.map((media) => ({
        ...media,
        appended_media_type: queryObj.media_type,
      }));

      const shuffled = utils.shuffle(meediaWithAppendedType);

      return res.send({ results: shuffled });
    })
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results', err } });
    });
});

export default router;
