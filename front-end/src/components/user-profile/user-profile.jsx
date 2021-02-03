import React from 'react';
import Paper from '@material-ui/core/Paper';

import './user-profile.scss';
import PlaceholderAnimatedButton from "../placeholder-animated-button";

const UserProfile = (props) => {

    return (
        <div className="user-profile__main">
            <form className="user-profile__container" action="">
                <div className="header">

                    <p className="username">Welcome to your profile {'username'}</p>
                    <p>Feel free to change your information.</p>
                </div>
                <div className="settings">
                    <PlaceholderAnimatedButton text="E-mail"
                                               className="input-set"
                                               value="example@email.com"
                                               wrapper="wrapper"
                    />
                    <PlaceholderAnimatedButton text="Username"
                                               className="input-set"
                                               value="Username"
                                               wrapper="wrapper"

                    />
                    <PlaceholderAnimatedButton text="Current password"
                                               className="input-set"
                                               value="Current password"
                                               wrapper="wrapper"

                    />
                    <div className="tips">
                        <p className="tip-header">Change account password</p>
                        <p>In case you don't want to change your password leave blanks below empty</p>
                    </div>

                    <div className="new-password-container">
                        <PlaceholderAnimatedButton text="New password"
                                                   className="input-set"
                                                   wrapper="wrapper"

                        />
                        <PlaceholderAnimatedButton text="Confirm new password"
                                                   className="input-set"
                                                   wrapper="wrapper"

                        />
                    </div>

                </div>
                <button type="button">Save</button>
            </form>
        </div>


    );
};

export default UserProfile;