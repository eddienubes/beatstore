import React, { useContext } from 'react';
import { AccordionContext, useAccordionToggle } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './accordion-button.scss';

function AccordionButton({ eventKey, callback }) {
  const currentEventKey = useContext(AccordionContext);
  const decoratedOnClick = useAccordionToggle(eventKey, () => callback && callback(eventKey));

  const isCurrentEventKey = currentEventKey === eventKey;

  const buttonContent = isCurrentEventKey ? (
    <span>
      <FontAwesomeIcon icon={faAngleUp} /> LESS
    </span>
  ) : (
    <span>
      <FontAwesomeIcon icon={faAngleDown} /> MORE
    </span>
  );
  return (
    <button type="button" onClick={decoratedOnClick} className="accordion-button__button">
      {buttonContent}
    </button>
  );
}

export default AccordionButton;
