import React from 'react';

import './blurred-spinner.scss';
import Spinner from "../spinner";

const BlurredSpinner = (props) => {

    return (
        <div className={`blurred-spinner`}>
            <Spinner/>
        </div>
    )
}

export default BlurredSpinner;