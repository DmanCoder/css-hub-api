import utils from '../utils';

type ErrorsType = { media_type: string };

const validateDiscover = (data) => {
  const errors = {} as ErrorsType;

  //   Check if expected params has been passed in
  data.media_type = !utils.isEmpty(data.media_type) ? data.media_type : '';

  //   Feedback accumulator
  if (utils.isEmpty(data.media_type)) {
    errors.media_type = '`media_type` is empty or has not been passed in as a query param';
  } else {
    if (data.media_type !== 'movie' && data.media_type !== 'tv' && data.media_type !== 'both') {
      errors.media_type = '`media_type` only accepts value of `movie`, `tv` or `both`';
    }
  }

  // return errors
  return {
    errors,
    isValid: utils.isEmpty(errors),
  };
};

export default validateDiscover;
