const isEmpty = require('../utils/isEmpty');

const validateTrending = (data) => {
  const errors = {};

  // Check if expected params has been passed in
  data.appended_media_type = !isEmpty(data.appended_media_type) ? data.appended_media_type : '';
  data.network_id = !isEmpty(data.network_id) ? data.network_id : '';
  data.time_window = !isEmpty(data.time_window) ? data.time_window : '';
  data.language = !isEmpty(data.language) ? data.language : '';
  data.page = !isEmpty(data.page) ? data.page : '';

  // Feedback accumulator
  if (isEmpty(data.appended_media_type)) {
    errors.appended_media_type = '`appended_media_type` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.time_window)) {
    errors.time_window = '`time_window` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.network_id)) {
    errors.network_id = '`network_id` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.language)) {
    errors.language = '`language` is empty or has not been passed in as a query param';
  }
  if (isEmpty(data.page)) {
    errors.page = '`page` is empty or has not been passed in as a query param';
  }

  // return errors
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateTrending;
