import React from "react";
import LicenseDescriptionModal from "../license-description-modal";
import './license-description-button.scss';

const LicenseDescriptionButton = (props) => {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <button className={props.className}
                    style={{width: props.width, height: props.height}}
                    onClick={() => setModalShow(true)}>
                {props.text}
            </button>

            <LicenseDescriptionModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
};

export default LicenseDescriptionButton;