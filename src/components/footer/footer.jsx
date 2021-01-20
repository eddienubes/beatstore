import React from "react";
import "./footer.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faInstagram } from "@fortawesome/free-brands-svg-icons";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-bootstrap/Modal';

const Footer = () => {

    return (
        <footer>
            <hr/>
            <div className="footer__wrapper">
                <div className="footer__copyright">
                    <span>Cherries By</span>
                    <span>Copyright 2020 <FontAwesomeIcon className="footer__circle" icon={faCircle}/>  <a
                        href="#">Terms of use</a></span>

                </div>
                <div className="footer__links">
                    <a href="#" className="footer__youtube"><img width="40" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1200px-YouTube_full-color_icon_%282017%29.svg.png" alt="asd"/></a>
                    <a href="#" className="footer__instagram"><img width="30" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png" alt="asd"/></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
