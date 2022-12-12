import {
  VALIDATOR_TYPE_CHECKED,
  VALIDATOR_TYPE_EMAIL,
  VALIDATOR_TYPE_FILE,
  VALIDATOR_TYPE_MAX,
  VALIDATOR_TYPE_MAXLENGTH,
  VALIDATOR_TYPE_MIN,
  VALIDATOR_TYPE_MINLENGTH,
  VALIDATOR_TYPE_NOT_REQUIRED_BUT_MIN_LENGTH,
  VALIDATOR_TYPE_REQUIRED
} from '../constants/validator-types';

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRED });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH = (payload) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  payload
});
export const VALIDATOR_MAXLENGTH = (payload) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  payload
});
export const VALIDATOR_MIN = (payload) => ({ type: VALIDATOR_TYPE_MIN, payload });
export const VALIDATOR_MAX = (payload) => ({ type: VALIDATOR_TYPE_MAX, payload });
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });
export const VALIDATOR_CHECKBOX = () => ({ type: VALIDATOR_TYPE_CHECKED });
export const VALIDATOR_NOT_REQUIRED_BUT_MIN_LENGTH = (payload) => ({
  type: VALIDATOR_TYPE_NOT_REQUIRED_BUT_MIN_LENGTH,
  payload
});

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRED) {
      isValid = isValid && value.trim().length > 0;
    } else if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.payload;
    } else if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.payload;
    } else if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.payload;
    } else if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= validator.payload;
    } else if (validator.type === VALIDATOR_TYPE_EMAIL) {
      const regExp =
        /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

      isValid = isValid && regExp.test(value);
    } else if (validator.type === VALIDATOR_TYPE_CHECKED) {
      isValid = value;
    } else if (validator.type === VALIDATOR_TYPE_NOT_REQUIRED_BUT_MIN_LENGTH) {
      isValid = isValid && (value.trim().length >= validator.payload || value.trim().length === 0);
    }
  }
  return isValid;
};
