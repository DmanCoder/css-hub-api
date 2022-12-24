import { ParsedUrlQuery } from 'querystring';
import isEmpty from './isEmpty';

/**
 * Dynamically convert query object provided from client
 * and return as a query param string
 */
const convertQueryObjectToParams = (queryObj: ParsedUrlQuery): string => {
  const params = [];
  for (const property in queryObj) params.push(`${property}=${queryObj[property]}`);
  if (!isEmpty(params)) return `&${params.join('&')}`
  return params.join('&');
};

export default convertQueryObjectToParams;
