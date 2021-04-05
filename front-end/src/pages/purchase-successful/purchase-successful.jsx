import React, {useEffect} from 'react';
import approved from './approved.png';
import './purchase-successful.scss';
import {useDispatch, useSelector} from "react-redux";
import {Redirect, useHistory} from "react-router-dom";
import {Link} from 'react-router-dom';
import {paymentAcceptanceDrop} from "../../redux/actions";

const PurchaseSuccessful = () => {
    const {payed} = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => dispatch(paymentAcceptanceDrop());
    });

    if (!payed) {
        return (<Redirect to={`/`}/>);
    }

    return (
        <div className={`payment-successful-container`}>
            <img src={approved} alt="approved-img"/>
            <h2>Dear customer, thank you for purchasing!</h2>
            <h3>Your payment has been accepted!</h3>
            <br/>
            <br/>
            <p className={`description`}>
                Please, checkout your email to download files you have payed for!
            </p>
            <p className={`nutshell`}>
                In case you have any issues during purchasing process, consider <Link to="/contact">contacting</Link> via my social media or email.
            </p>
        </div>
    )
}

export default PurchaseSuccessful;