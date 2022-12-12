import React, { useEffect } from 'react';
import err from './error.png';
import './purchase-failed.scss';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { paymentDeclineDrop } from '../../redux/actions';

function PurchaseFailed() {
  const { paymentError } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => () => dispatch(paymentDeclineDrop()));

  if (!paymentError) {
    return <Redirect to="/" />;
  }

  return (
    <div className="payment-failed-container">
      <img src={err} alt="failed-img" />
      <h2>Dear customer, something went wrong!</h2>
      <h3>An issue occurred while updating your account and processing payment!</h3>
      <br />
      <br />
      <p className="description">There is an unknown error occurred while trying to process your payment!</p>
      <p className="nutshell">
        Please, try again or consider <Link to="/contact">contact</Link> me if this page appears multiple times.
      </p>
      <br />
      <p className="hint">
        Error message <br />
        You can include the text below if you decided to contact.
      </p>
      <p className="error">{paymentError.toString()}</p>
    </div>
  );
}

export default PurchaseFailed;
