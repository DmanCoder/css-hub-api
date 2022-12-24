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
 * details of a media, provided that `media_id` is given.
 *
 * ROUTE - GET /api/details
 */
router.get('/', (req, res) => {
  const { media_type, media_id, ...restOfQueryObj } = url.parse(req.url, true).query; // Query params provided by frontend
  const params = utils.convertQueryObjectToParams(restOfQueryObj);
  const endPoint = `/${media_type}/${media_id}?api_key=${process.env.THE_MOVIE_DATABASE_API}${params}`;

  // Reject if expected params are not present
  const { errors, isValid } = validate.details({ ...restOfQueryObj, media_type, media_id });
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  dbAPI
    .get(endPoint)
    .then((response) => {
      const { data } = response;
      const resultsWithAppendedMediaTyp = { ...data, appended_media_type: media_type };
      return res.send({ results: resultsWithAppendedMediaTyp });
    })
    .catch((err) => {
      res.status(500);
      res.send({ errors: { message: 'Issues Fetching results', err } });
    });
});

export default router;
