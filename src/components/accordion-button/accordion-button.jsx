import React, {useContext} from "react";
import {AccordionContext, useAccordionToggle} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import './accordion-button.scss';

const AccordionButton = ({eventKey, callback}) => {
    const currentEventKey = useContext(AccordionContext);
    const decoratedOnClick = useAccordionToggle(
        eventKey,
        () => callback && callback(eventKey)
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    let buttonContent = isCurrentEventKey ?
        <span><FontAwesomeIcon icon={faAngleUp}/> LESS</span> : <span><FontAwesomeIcon icon={faAngleDown}/> MORE</span>;
    return (
        <button
            type="button"
            onClick={decoratedOnClick}
            className="accordion-button__button"
        >
            {buttonContent}
        </button>
    );
};

export default AccordionButton;