import express from 'express';
import url from 'url';

// Axios init
import { dbAPI } from '../../axios/init';

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
router.get('/', (req, res) => {
  const { media_type, ...restOfParams } = url.parse(req.url, true).query; // Query params provided by frontend
  const params = utils.convertQueryObjectToParams(restOfParams);
  const endPoint = `/discover/${media_type}?api_key=${process.env.THE_MOVIE_DATABASE_API}${params}`;

  dbAPI
    .get(endPoint)
    .then((response) => {
      const { results } = response.data;
      const meediaWithAppendedType = results.map((media) => ({
        ...media,
        appended_media_type: media_type,
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
