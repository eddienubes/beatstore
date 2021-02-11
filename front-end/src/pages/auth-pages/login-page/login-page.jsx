import React from "react";
import "../auth-page.scss";
import {Link, Redirect, useHistory} from "react-router-dom";
import {VALIDATOR_EMAIL, VALIDATOR_REQUIRE} from "../../../utils/validators";
import Input from "../input";
import useForm from "../../../hooks/form-hook";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../../components/spinner";
import {login} from "../../../redux/actions/actions";

const LoginPage = ({loggedIn}) => {
    const history = useHistory();
    const userState = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const initialState = {
        inputs: {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        isValid: false
    }
    const [formState, onInputHandler] = useForm(initialState.inputs, initialState.isValid);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(login(formState.inputs));
    }

    if (userState.processing) {
        return <Spinner/>;
    }

    if (userState.loggedIn) {
        return <Redirect to="/"/>;
    }

    const invalidCredentialsMsg = userState.error ? (
        <p className="confirm-pass-error-msg">{userState.error.message}</p>) : null;

    return (
        <div className="auth-page">
            {/* todo there might be logo*/}
            <h2>Sign in to continue</h2>
            <form onSubmit={onSubmitHandler} className="email-login-form">
                <p>Email or username</p>
                <Input id="email"
                       name="email"
                       placeholder="Type your email.."
                       type="text"
                       errorText="Email field is required and should have a correct form"
                       validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                       onInput={onInputHandler}/>
                <div className="over-password"><p>Password</p> <a href="/forgot-password">Forgot password?</a></div>
                <Input id="password"
                       name="password"
                       placeholder="Type your password.."
                       type="password"
                       errorText="Password field is required"
                       validators={[VALIDATOR_REQUIRE()]}
                       onInput={onInputHandler}/>
                <button className={formState.isValid ? "sign-up-button" : "unchecked-button"} type="submit">Sign in
                </button>
                {invalidCredentialsMsg}
            </form>
            {/*<h2 className="divider-h2">*/}
            {/*    <div className="line"/>*/}
            {/*    <span>OR</span>*/}
            {/*    <div className="line"/>*/}
            {/*</h2>*/}
            {/* todo add google oauth */}
            {/*<button className="oauth">*/}
            {/*    <img*/}
            {/*        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"*/}
            {/*        width="15"*/}
            {/*        height="15"*/}
            {/*        alt="Google"*/}
            {/*    />*/}
            {/*    Sign in with Google*/}
            {/*</button>*/}
            <p>New to us? <Link to="/auth/register">Sign up</Link></p>
        </div>
    )
}


export default LoginPage;