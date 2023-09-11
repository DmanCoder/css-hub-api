import utils from '../utils/index';

type ErrorsType = { media_type: string; media_id: string };

const validateDetails = (data) => {
  const errors = {} as ErrorsType;

  //   Check if expected params has been passed in
  data.media_type = !utils.isEmpty(data.media_type) ? data.media_type : '';
  data.media_id = !utils.isEmpty(data.media_id) ? data.media_id : '';

  //   Feedback accumulator
  if (utils.isEmpty(data.media_type)) {
    errors.media_type = '`media_type` is empty or has not been passed in as a query param';
  } else {
    if (data.media_type !== 'movie' && data.media_type !== 'tv' && data.media_type !== 'both') {
      errors.media_type = '`media_type` only accepts value of `movie`, `tv` or `both`';
    }
  }

  if (utils.isEmpty(data.media_id)) {
    errors.media_id = '`media_id` is empty or has not been passed in as a query param';
  }

  // return errors
  console.log(errors, 'errors validateDetails')

  return {
    errors,
    isValid: utils.isEmpty(errors),
  };
};

export default validateDetails;
