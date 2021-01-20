import React, {useState} from "react";
import "./track.scss";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LicenseTypeModal from "../license-type-modal";
import {withPlayables} from '../hoc';

const Track = ({track, setSelectedTrack, setPreviousTrack, playBack, audio}) => {
    // TODO Warning problem (look at the console)
    const [modalShow, setModalShow] = useState(false);
    const [className, setClassName] = useState("");

    // if (track.id === audio.selectedTrack) {
    //     setClassName("selected_tr")
    // } else {
    //     setClassName("");
    // }


    return (
        <tr className={className}
            onClick={() => {
                playBack();
            }}>
            <td className="track__td-img">
                <img className="td-img-main" src={track.imgUrl} alt="beat image"/>
            </td>
            <td className="title">
                {track.name}
            </td>
            <td className="time">
                {track.time}
            </td>
            <td className="bpm">
                {track.bpm}
            </td>
            <td className="track__tags">
                {track.tags.map((tag, i) => <b key={i} className="track__tag">#{tag}</b>)}
            </td>
            <td className="add-to-cart">
                <button className="track__to-cart-button" onClick={(e) => {
                    e.stopPropagation();
                    setModalShow(true);
                }}>
                    <FontAwesomeIcon icon={faShoppingCart}/> ADD
                </button>
                <LicenseTypeModal key={track.id}
                                  track={track}
                                  buttonClass="cart_button"
                                  show={modalShow}
                                  setOpen={setModalShow}/>
            </td>
        </tr>

    );
}


export default withPlayables(Track);
