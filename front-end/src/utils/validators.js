import {
    VALIDATOR_TYPE_EMAIL,
    VALIDATOR_TYPE_FILE,
    VALIDATOR_TYPE_MAX,
    VALIDATOR_TYPE_MAXLENGTH,
    VALIDATOR_TYPE_MIN,
    VALIDATOR_TYPE_MINLENGTH,
    VALIDATOR_TYPE_REQUIRE,
    VALIDATOR_TYPE_CHECKED
} from '../constants/validator-types';

export const VALIDATOR_REQUIRE = () => ({type: VALIDATOR_TYPE_REQUIRE});
export const VALIDATOR_FILE = () => ({type: VALIDATOR_TYPE_FILE});
export const VALIDATOR_MINLENGTH = payload => ({
    type: VALIDATOR_TYPE_MINLENGTH,
    payload: payload
});
export const VALIDATOR_MAXLENGTH = payload => ({
    type: VALIDATOR_TYPE_MAXLENGTH,
    payload: payload
});
export const VALIDATOR_MIN = payload => ({type: VALIDATOR_TYPE_MIN, payload: payload});
export const VALIDATOR_MAX = payload => ({type: VALIDATOR_TYPE_MAX, payload: payload});
export const VALIDATOR_EMAIL = () => ({type: VALIDATOR_TYPE_EMAIL});
export const VALIDATOR_CHECKBOX = () => ({type: VALIDATOR_TYPE_CHECKED});

export const validate = (value, validators) => {
    let isValid = true;
    for (const validator of validators) {
        if (validator.type === VALIDATOR_TYPE_REQUIRE) {
            isValid = isValid && value.trim().length > 0;
        }
        if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
            isValid = isValid && value.trim().length >= validator.payload;
        }
        if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
            isValid = isValid && value.trim().length <= validator.payload;
        }
        if (validator.type === VALIDATOR_TYPE_MIN) {
            isValid = isValid && +value >= validator.payload;
        }
        if (validator.type === VALIDATOR_TYPE_MAX) {
            isValid = isValid && +value <= validator.payload;
        }
        if (validator.type === VALIDATOR_TYPE_EMAIL) {
            isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
        }
        if (validator.type === VALIDATOR_TYPE_CHECKED) {
            isValid = value;
        }
    }
    return isValid;
};
