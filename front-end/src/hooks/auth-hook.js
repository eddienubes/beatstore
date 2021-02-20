import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {login, logOut} from "../redux/actions";

let logoutTimer;

const useAuth = () => {
    const dispatch = useDispatch();
    const [checking, setChecking] = useState(true);
    const {token, expiration} = useSelector(state => state.userReducer);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData &&
            userData.token &&
            new Date(userData.expiration) > new Date()) {

            dispatch(login(undefined, userData));
            setChecking(false);
        }
        else {
            setChecking(false);
        }
    }, [dispatch]);

    useEffect(() => {
        if (token && expiration) {
            const remainingTime = new Date(expiration).getTime() - new Date().getTime();
            // console.log(remainingTime);
            logoutTimer = setTimeout(() => {dispatch(logOut()); console.log('LOGGED OUT')}, remainingTime);
        }
        else {
            clearTimeout(logoutTimer);
        }
    }, [token, expiration]);

    return [checking]
}

export default useAuth;

