import React, {useEffect, useState} from 'react';
import PlaceholderAnimatedButton from "../placeholder-animated-button";
import Input from "../../pages/auth-pages/input";

import useForm from "../../hooks/form-hook";
import {VALIDATOR_EMAIL, VALIDATOR_NOT_REQUIRED_BUT_MIN_LENGTH, VALIDATOR_REQUIRE} from "../../utils/validators";

import './user-profile.scss';
import Spinner from "../spinner";

const UserProfile = (props) => {
    const [isLoading, setLoading] = useState(true); // temporary solution
    const [touched, setTouched] = useState(false);
    const initialState = {
        inputs: {
            email: {
                value: '',
                isValid: false
            },
            username: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            },
            newPassword: {
                value: '',
                isValid: false
            },
            newPasswordConfirmed: {
                value: '',
                isValid: false
            }
        },
        isValid: false
    }

    const [formState, onInputHandler, setFormData] = useForm(initialState.inputs, initialState.isValid)

    useEffect(() => {
        // read data from redux store TODO
        setFormData({
                email: {
                    value: 'example@email.com',
                    isValid: false
                },
                username: {
                    value: 'example username',
                    isValid: false
                },
                password: {
                    value: '',
                    isValid: false
                },
                newPassword: {
                    value: '',
                    isValid: false
                },
                newPasswordConfirmed: {
                    value: '',
                    isValid: false
                }
            }, false
        );
        setLoading(false);
    }, []); // add user data and setFormData in dependencies TODO

    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log(formState);
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

    if (isLoading) { // use of redux loading state should be there TODO
        return <Spinner/>
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

                    <p className="username">Welcome to your profile {'username'}</p>
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
                            validators={[VALIDATOR_NOT_REQUIRED_BUT_MIN_LENGTH(6)]}
                            onInput={onInputHandler}
                        />

                    </div>
                </div>
                <button type="button" disabled={!formState.isValid}>Save</button>
                {errorMsg}
                {errorMsg2}
            </form>
        </div>
    );
};

export default UserProfile;