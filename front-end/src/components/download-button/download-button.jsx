import React, { useState } from 'react';
import BeatstoreService from "../../services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import SpinnerAudio from "../spinner-audio";
import './download-button.scss';

const DownloadButton = ({ id, fileName }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        const beatstoreService = new BeatstoreService();
        setLoading(true);
        beatstoreService.downloadBeat(id)
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                console.log(url);
                link.href = url;
                link.setAttribute('download', `${fileName}.mp3`);

                document.body.appendChild(link);

                link.click();

                link.parentNode.removeChild(link);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                throw new Error(err)
            });
    }


    return (
        <div className="download-button__wrapper">
            {
                !loading ? (<button onClick={handleClick}><FontAwesomeIcon icon={faDownload}/>
                    &nbsp;DOWNLOAD
                </button>) : <SpinnerAudio/>
            }

        </div>

    )
}

export default DownloadButton;