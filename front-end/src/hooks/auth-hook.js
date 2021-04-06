import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {userDataFetchSuccessful, login, logOut, refreshToken} from "../redux/actions";

let refreshTokenTimer;
let logoutTimer;

const useAuth = () => {
    const dispatch = useDispatch();
    const [checking, setChecking] = useState(true);
    const {token, expiration, refreshToken: currentRToken, refreshTokenExpirationDate, cart} = useSelector(state => state.userReducer);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const cartData = JSON.parse(localStorage.getItem('cartData'));
        if (userData &&
            userData.token &&
            new Date(userData.expiration) > new Date()) {

            dispatch(login(undefined, userData));
            setChecking(false);
        }
        else if (cartData) {
            dispatch(userDataFetchSuccessful({cart: userData}));
            setChecking(false);
        }
        else {
            localStorage.setItem('cartData', JSON.stringify(cart));
            setChecking(false);
        }
    }, [dispatch]);

    useEffect(() => {
        if (token && expiration) {
            const remainingTimeAccessToken = new Date(expiration).getTime() - new Date().getTime();
            refreshTokenTimer = setTimeout(
                () => {dispatch(refreshToken(currentRToken))},
                remainingTimeAccessToken);
        }
        else {
            clearTimeout(refreshTokenTimer);
        }
    }, [token, expiration]);

    useEffect(() => {
        if (refreshToken && refreshTokenExpirationDate) {
            const remainingTimeRefreshToken = new Date(refreshTokenExpirationDate).getTime() - new Date().getTime();
            logoutTimer = setTimeout(
                () => {dispatch(logOut())}, remainingTimeRefreshToken
            );
        }
        else {
            clearTimeout(logoutTimer);
        }
    }, [refreshToken, refreshTokenExpirationDate])

    return [checking];
}

export default useAuth;

