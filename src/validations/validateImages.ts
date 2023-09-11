import utils from '../utils/index';

type ErrorsType = { media_id: string; season_number: string };

const validateImages = (data) => {
  const errors = {} as ErrorsType;
  console.log(data, 'validateImages')

  // Check if expected params has been passed in
  data.media_id = !utils.isEmpty(data.media_id) ? data.media_id : '';
  data.season_number = !utils.isEmpty(data.season_number) ? data.season_number : '';

  //   Feedback accumulator
  if (utils.isEmpty(data.media_id)) {
    errors.media_id = '`media_id` is empty or has not been passed in as a query param';
  }

  if (utils.isEmpty(data.season_number)) {
    errors.season_number = '`season_number` is empty or has not been passed in as a query param';
  }

  // return errors
  return {
    errors,
    isValid: utils.isEmpty(errors),
  };
};

export default validateImages;
