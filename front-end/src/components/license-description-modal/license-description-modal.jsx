import Modal from "react-bootstrap/Modal";
import {Button} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import './license-description-modal.scss';
import LicensesService from "../../services/licenses-service";
import ErrorIndicator from "../error-indicator";
import SpinnerAudio from "../spinner-audio";

const LicenseDescriptionModal = (props) => {
    const [licenseContent, setLicenseContent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const licensesService = new LicensesService();
        licensesService.getLicenseTemplate(props.type)
            .then(res => {
                setLicenseContent(res.data);
                console.log(res);
                setLoading(false);
            })
            .catch(e => {
                setError(e);
                setLoading(false);
            });
    }, [props.type]);

    if (loading && !error) {
        return (<SpinnerAudio/>);
    }

    return (
        <Modal className="modal-pop"
               {...props}
               size="lg"
               centered
               scrollable
        >
            <Modal.Header className="modal-header" closeButton>
                <div className="modal-header-text">FULL LICENSE DESCRIPTION</div>
            </Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={{__html: licenseContent}}/>
                {error && <ErrorIndicator/>}
            </Modal.Body>
            <Modal.Footer>
                <Button className="license-close-button" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LicenseDescriptionModal;
