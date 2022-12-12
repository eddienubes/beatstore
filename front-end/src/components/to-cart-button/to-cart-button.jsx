import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import LicenseTypeModal from '../license-type-modal';
import './to-cart-button.scss';

function ToCartButton({ isInCart, track }) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="to-cart-button__wrapper">
      <button
        className={`track__to-cart-button ${isInCart ? 'in-cart-button' : null}`}
        onClick={(e) => {
          e.stopPropagation();
          setModalShow(true);
        }}
      >
        {isInCart ? (
          <>
            <FontAwesomeIcon icon={faCheckCircle} /> IN CART
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faShoppingCart} /> ADD
          </>
        )}
      </button>
      <LicenseTypeModal
        key={track.id}
        isInCart={isInCart}
        track={track}
        buttonClass="cart_button"
        show={modalShow}
        setOpen={setModalShow}
      />
    </div>
  );
}

export default ToCartButton;
