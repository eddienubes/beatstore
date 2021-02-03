import React, {useCallback, useState, useReducer} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Input from "../input";
import {VALIDATOR_CHECKBOX, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../../utils/validators";
import useForm from "../../../hooks/form-hook";


const RegisterPage = ({loggedIn}) => {
    const history = useHistory();
    const [checked, setChecked] = useState(false);
    const [touched, setTouched] = useState(false);

    const initialState = {
        inputs: {
            username: {
                value: '',
                isValid: false
            },
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            },
            confirmedPassword: {
                value: '',
                isValid: false
            }
        },
        isValid: false,
        confirmed: false
    };

    const [formState, onInputHandler] = useForm(initialState.inputs, initialState.isValid, initialState.confirmed);

    const onChangeCheckboxHandle = (e) => {
        setChecked(!checked);
    };



    const onUserSignupHandler = (e) => {
        e.preventDefault();

        console.log(formState.inputs);
    }

    const canSignup = checked && formState.isValid && formState.confirmed;
    const confirmedMsg = !formState.confirmed && touched ?
        <p className="confirm-pass-error-msg">Password and confirmed password should be identical</p> : null;

    return (
        <div className="auth-page">
            {/* todo there might be logo*/}
            <h2>Register</h2>
            <form onBlur={() => setTouched(true)}
                  className="email-login-form"
                  onSubmit={onUserSignupHandler}
            >
                <p>Your username</p>
                <Input id="username"
                       name="username"
                       placeholder="Set a username for your profile"
                       type="text"
                       errorText="Please, enter at least 1 character as your username"
                       validators={[VALIDATOR_MINLENGTH(1)]}
                       onInput={onInputHandler}
                />
                <p>Your email</p>
                <Input id="email"
                       name="email"
                       placeholder="Type your email.."
                       type="text"
                       errorText="Please enter correct email"
                       validators={[VALIDATOR_EMAIL()]}
                       onInput={onInputHandler}
                />
                <p>Password</p>
                <Input id="password"
                       name="password"
                       placeholder="Type your password.."
                       type="password"
                       errorText="Your password should contain at least 6 characters"
                       validators={[VALIDATOR_MINLENGTH(6)]}
                       onInput={onInputHandler}
                />
                <p>Confirmed password</p>
                <Input id="confirmedPassword"
                       name="confirmed_password"
                       placeholder="Confirm your password.."
                       type="password"
                       errorText="Your password should contain at least 6 characters"
                       validators={[VALIDATOR_MINLENGTH(6)]}
                       onInput={onInputHandler}
                />
                <label>
                    <Input
                        id="checkbox"
                        onChangeHandler={onChangeCheckboxHandle}
                        type="checkbox"
                        name="checked"
                        validators={[VALIDATOR_CHECKBOX()]}
                    />
                    <span className="labeled-text">
                        {/* todo Ссылки на Terms of service и на Privacy policy*/}
                        I have read and agree to the <a>Terms of service</a> and <a>Privacy policy</a>
                    </span>
                </label>
                <button className={canSignup ? "sign-up-button" : "unchecked-button"} type="submit">Sign up</button>
                {confirmedMsg}
            </form>
            <h2 className="divider-h2">
                <div className="line"/>
                <span>OR</span>
                <div className="line"/>
            </h2>
            <button className="oauth">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                    width="15"
                    height="15"
                    alt="Google"
                />
                Sign up with Google
            </button>
            <p>Already have an account? <Link to="/auth/login">Sign in</Link></p>

        </div>
    );
};


export default RegisterPage;
