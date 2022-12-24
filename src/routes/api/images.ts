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
 * poster images for each episode for the specified season
 *
 * ROUTE - GET /api/discover/movies || /api/discover/tv
 */
router.get('/tv/season/poster_image_per_episode', (req, res) => {
  const { media_id, season_number, ...restOfQueryObj } = url.parse(req.url, true).query; // Query params provided by frontend
  const params = utils.convertQueryObjectToParams(restOfQueryObj);
  const endPoint = `/tv/${media_id}/season/${season_number}?api_key=${process.env.THE_MOVIE_DATABASE_API}${params}`;

  // Reject if expected params are not present
  const { errors, isValid } = validate.images({ ...restOfQueryObj, media_id, season_number });
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  dbAPI
    .get(endPoint)
    .then((response) => {
      const { data } = response;
      return res.send({ results: data });
    })
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results', err } });
    });
});

export default router;
