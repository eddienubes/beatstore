import React from 'react';
import './footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import { PRODUCER_NAME } from '../../constants/content';

function Footer() {
  return (
    <footer>
      <div className="footer__wrapper">
        <div className="footer__copyright">
          <span>{PRODUCER_NAME}</span>
          <span>
            Copyright {new Date().getFullYear()} &nbsp;
            <FontAwesomeIcon className="footer__circle" icon={faCircle} /> <a href="#">Terms of use</a>
          </span>
        </div>
        <div className="footer__links">
          <a href="youtube" target="_blank" className="youtube">
            <img
              width="40"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1200px-YouTube_full-color_icon_%282017%29.svg.png"
              alt="asd"
            />
            &nbsp; /{PRODUCER_NAME}
          </a>
          <a href="instagram" className="instagram">
            <img
              width="30"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png"
              alt="asd"
            />
            &nbsp; /{PRODUCER_NAME}
          </a>
          <a href="instagram" className="instagram">
            <img width="30" src="https://img.icons8.com/color/48/000000/twitter--v1.png" alt="twitter" />
            &nbsp; /{PRODUCER_NAME}
          </a>
          <a href="instagram" className="instagram">
            <img width="30" src="https://img.icons8.com/fluent/48/000000/facebook-new.png" alt="twitter" />
            &nbsp; /{PRODUCER_NAME}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
