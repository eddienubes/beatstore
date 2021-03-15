import React, {useEffect, useState} from 'react';

import './confrimation-page.scss';
import img from './tick.png';
import err from './error.png';
import {useDispatch, useSelector} from "react-redux";
import userReducer from "../../redux/reducers/user-reducer";
import SpinnerAudio from "../../components/spinner-audio";
import {useHistory, useParams} from "react-router-dom";
import {confirmationErrorRemoved, confirmUser} from "../../redux/actions/actions";

let intervalID;

const ConfirmationPage = () => {
    const dispatch = useDispatch();
    const {isConfirming, confirmationError} = useSelector(state => state.userReducer);
    const [time, setTime] = useState(5);
    const {confirmationCode} = useParams();
    const history = useHistory();
    const [id, setIntervalID] = useState(null);

    useEffect(() => {
        dispatch(confirmUser(confirmationCode));
    }, []);

    useEffect(() => {
        if (time === 0 && !isConfirming) {
            dispatch(confirmationErrorRemoved());
            clearInterval(id);
            history.push('/');
        }
    }, [time, isConfirming]);

    useEffect(() => {
        let interval;
        if (!isConfirming) {
            interval = setInterval(() => {
                setTime(timer => timer - 1);
            },1000);
            setIntervalID(interval);
            return () => {
                clearInterval(interval);
            };
        }
    }, [isConfirming])

    if (isConfirming) {
        return (<SpinnerAudio/>);
    }

    return (
        <div className={`confirmation-container`}>
            <img src={confirmationError ? err : img} alt="confirmed"/>
            {confirmationError ? (
                <>
                    <p className={`caption`}>Invalid confirmation code..</p>
                    <p className={`seconds`}>{time} second(s) remaining until you are redirected</p>
                </> ) : (
                    <>
                        <p className={`caption`}>Congratulation, you have been successfully registered</p>
                        <p className={`seconds`}>{time} second(s) remaining until you are automatically logged in</p>
                    </>)}
        </div>
    )
}

export default ConfirmationPage;