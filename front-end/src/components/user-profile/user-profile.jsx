import React, {useMemo, useState} from 'react';
import PlaceholderAnimatedButton from "../placeholder-animated-button";
import Input from "../../pages/auth-pages/input";
import Spinner from "../spinner";
import {useSelector} from "react-redux";
import useForm from "../../hooks/form-hook";
import {VALIDATOR_EMAIL, VALIDATOR_NOT_REQUIRED_BUT_MIN_LENGTH, VALIDATOR_REQUIRE} from "../../utils/validators";
import {withAuthService} from '../hoc';

import './user-profile.scss';
import ErrorIndicator from "../error-indicator";


const UserProfile = ({authService}) => {
    const {processing, email, username, id} = useSelector(state => state.userReducer);
    const [errorSettings, setErrorSettings] = useState(null);

    const initialState = useMemo(() => {
        return {
            inputs: {
                email: {
                    value: email,
                    isValid: true
                },
                username: {
                    value: username,
                    isValid: true
                },
                password: {
                    value: '',
                    isValid: false
                },
                newPassword: {
                    value: '',
                    isValid: true
                },
                newPasswordConfirmed: {
                    value: '',
                    isValid: true
                }
            },
            isValid: false
        }
    }, [username, email]);

    const [touched, setTouched] = useState(false);
    const [formState, onInputHandler, setFormData] = useForm(initialState.inputs, initialState.isValid)
    console.log(formState);
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        authService.updateUser(id, {
            email: formState.inputs.email.value,
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
            newPassword: formState.inputs.newPassword.value
        })
            .then(({user}) => {

            })
            .catch(response => {
                setErrorSettings(response.data);
            });
    }

    const {newPassword, newPasswordConfirmed} = formState.inputs;

    const hasConfirmedError = newPassword.value !== newPasswordConfirmed.value;
    const errorMsg = hasConfirmedError ?
        <p className="user-profile__error-msg">Your new password and new confirmed password should be
            identical</p> : null;


    const hasEnoughCharacters = newPassword.value > 6 && newPasswordConfirmed.value > 6 ||
        newPassword.value.length === 0 && newPasswordConfirmed.value.length === 0;
    const errorMsg2 = !hasEnoughCharacters && touched ?
        (<p className="user-profile__error-msg">Your new password should contain at least 6 characters</p>) : null;

    if (processing) {
        return <Spinner/>
    }

    if (errorSettings) {
        return <ErrorIndicator/>
    }

    return (
        <div className="user-profile__main">
            <form
                onSubmit={onSubmitHandler}
                className="user-profile__container"
                onBlur={e => {
                    e.preventDefault();
                    setTouched(true);
                }}>
                <div className="header">

                    <p className="username">Welcome to your profile, {username}</p>
                    <p>Feel free to change your information.</p>
                </div>
                <div className="settings">
                    <Input
                        component={<PlaceholderAnimatedButton text="E-mail"
                                                              className="input-set"
                                                              wrapper="wrapper"/>}
                        id="email"
                        name="email"
                        type="text"
                        errorText="Please enter correct email address"
                        validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
                        onInput={onInputHandler}
                        initialValue={formState.inputs.email.value}
                        initialValid={formState.inputs.email.isValid}
                    />
                    <Input
                        component={<PlaceholderAnimatedButton text="Username"
                                                              className="input-set"
                                                              wrapper="wrapper"/>}
                        id="username"
                        name="username"
                        type="text"
                        errorText="Please enter at least 1 character as username"
                        validators={[VALIDATOR_NOT_REQUIRED_BUT_MIN_LENGTH(1)]}
                        onInput={onInputHandler}
                        initialValue={formState.inputs.username.value}
                        initialValid={formState.inputs.username.isValid}
                    />
                    <Input
                        component={<PlaceholderAnimatedButton text="Current password"
                                                              className="input-set"
                                                              wrapper="wrapper"
                        />}
                        id="password"
                        name="password"
                        type="password"
                        errorText="This field is required to change your data.."
                        validators={[VALIDATOR_REQUIRE()]}
                        onInput={onInputHandler}
                    />

                    <div className="tips">
                        <p className="tip-header">Change account password</p>
                        <p>In case you don't want to change your password leave blanks below empty</p>
                    </div>

                    <div className="new-password-container">
                        <Input
                            component={<PlaceholderAnimatedButton text="New password"
                                                                  className="input-set"
                                                                  wrapper="wrapper"

                            />}
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            errorText=""
                            initialValid={true}
                            validators={[VALIDATOR_NOT_REQUIRED_BUT_MIN_LENGTH(6)]}
                            onInput={onInputHandler}
                        />
                        <Input
                            component={<PlaceholderAnimatedButton text="Confirm new password"
                                                                  className="input-set"
                                                                  wrapper="wrapper"

                            />}
                            id="newPasswordConfirmed"
                            name="newPasswordConfirmed"
                            type="password"
                            errorText=""
                            initialValid={true}
                            validators={[VALIDATOR_NOT_REQUIRED_BUT_MIN_LENGTH(6)]}
                            onInput={onInputHandler}
                        />

                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!formState.isValid}
                >Save</button>
                {errorMsg}
                {errorMsg2}
            </form>
        </div>
    );
};

export default withAuthService(UserProfile);