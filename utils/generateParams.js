/**
 * Dynamically generates params provided from client
 * @param {object} value
 * @returns {boolean}
 */
const generateParams = (objParams) => {
  const params = [];

  for (const property in objParams) {
    params.push(`${property}=${objParams[property]}`);
  }

  return params.join('&');
};

module.exports = generateParams;
