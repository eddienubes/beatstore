import React from 'react';
import AuthService from "../../services/auth-service";

const withAuthService = (Wrapped) => {
    const authService = new AuthService();

    return (props) => {
        return (
            <Wrapped {...props} authService={authService}/>
        );
    }
}

export default withAuthService;