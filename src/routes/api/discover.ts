import { RequestHandler } from 'express';

import url from 'url';

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume.
 * @route     GET /api/discover
 * @param     {req, res} - Request & Response
 * @access    Public
 */
const discover: RequestHandler = (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.send({ testing: 'testing..' });
};

export default discover;
