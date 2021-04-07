import React, {useState} from 'react';
import {Link, Redirect, useHistory} from 'react-router-dom';
import Input from "../input";
import {VALIDATOR_CHECKBOX, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH} from "../../../utils/validators";
import useForm from "../../../hooks/form-hook";
import {withAuthService} from '../../../components/hoc';
import {
    googleContinue,
    googleContinueFailed,
    signup,
    userErrorCleared
} from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../../components/spinner";
import {GoogleLogin} from 'react-google-login';
import SecondRegistrationStep from "../../../components/second-registration-step";

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


const RegisterPage = ({authService}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const userState = useSelector(state => state.userReducer)
    const [checked, setChecked] = useState(false);
    const [touched, setTouched] = useState(false);
    const [hasRegistered, setRegistered] = useState(false);

    const [formState, onInputHandler] = useForm(initialState.inputs, initialState.isValid, initialState.confirmed);

    const onChangeCheckboxHandle = (e) => {
        setChecked(!checked);
    };

    const onUserSignupHandler = async (e) => {
        e.preventDefault();
        dispatch(signup(formState));
        setRegistered(true);
        setChecked(false);
        setTouched(false);
    }

    const googleSuccess = async (res) => {
        dispatch(googleContinue(res.tokenId));
    }

    const googleFailure = async (err) => {
        dispatch(googleContinueFailed(err));
    }

    const canSignup = checked && formState.isValid && formState.confirmed;
    const confirmedMsg = !formState.confirmed && touched ?
        (<p className="confirm-pass-error-msg">Password and confirmed password should be identical</p>) : null;

    const alreadyExistsError = userState.error && !formState.isValid ? (
        <p className="confirm-pass-error-msg">{userState.error.message}</p>
    ) : null

    if (userState.processing) {
        return <Spinner/>
    }

    if (userState.loggedIn) {
        return <Redirect to="/"/>;
    }
    console.log(hasRegistered);
    console.log(userState.error);
    return (
        <div className="auth-page">
            {/* todo there might be a logo*/}
            {hasRegistered && !userState.error ? <SecondRegistrationStep/> :
                <>
                    <h2>Register</h2>
                    <form onBlur={() => setTouched(true)}
                          className="email-login-form"
                          onSubmit={onUserSignupHandler}
                    >
                        <p className={`caption`}>Your username</p>
                        <Input id="username"
                               name="username"
                               placeholder="Set a username for your profile"
                               type="text"
                               errorText="Please, enter at least 1 character as your username"
                               validators={[VALIDATOR_MINLENGTH(1)]}
                               onInput={onInputHandler}
                        />
                        <p className={`caption`}>Your email</p>
                        <Input id="email"
                               name="email"
                               placeholder="Type your email.."
                               type="text"
                               errorText="Please enter correct email"
                               validators={[VALIDATOR_EMAIL()]}
                               onInput={onInputHandler}
                        />
                        <p className={`caption`}>Password</p>
                        <Input id="password"
                               name="password"
                               placeholder="Type your password.."
                               type="password"
                               errorText="Your password should contain at least 6 characters"
                               validators={[VALIDATOR_MINLENGTH(6)]}
                               onInput={onInputHandler}
                        />
                        <p className={`caption`}>Confirmed password</p>
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
                        <button className={canSignup ? "sign-up-button" : "unchecked-button"} type="submit">Sign up
                        </button>
                        {confirmedMsg}
                        {alreadyExistsError}
                    </form>
                    <h2 className="divider-h2">
                        <div className="line"/>
                        <span>OR</span>
                        <div className="line"/>
                    </h2>
                    <GoogleLogin
                        uxMode={`popup`}
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        render={renderProps =>
                            (
                                <button
                                    className="oauth"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                                        width="15"
                                        height="15"
                                        alt="Google"
                                    />
                                    Continue with Google
                                </button>
                            )
                        }
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy={`single_host_origin`}
                    />
                    <p className={`transfer-to-login`}>Already have an account?
                        <Link to="/auth/login"
                              onClick={e => dispatch(userErrorCleared())}
                        >
                            &nbsp;Sign in
                        </Link>
                    </p>
                </>}

        </div>
    );
};


export default withAuthService(RegisterPage);
