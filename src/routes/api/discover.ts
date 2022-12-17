import express from 'express';
import url from 'url';

const router = express.Router();

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/discover
 * @param     {req, res} - Request & Response
 * @access    Public
 */
router.get('/', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.send({ testing: 'this is a test' });
});

export default router;
