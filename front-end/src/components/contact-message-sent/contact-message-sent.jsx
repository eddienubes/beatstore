import React from 'react';
import './contact-message-sent.scss';
import { PRODUCER_NAME } from '../../constants/content';

function ContactMessageSent() {
  return (
    <div className="message-sent-container">
      <p>Your message has been sent successfully!</p>
      <p>I will respond you in approximately 1 day, but I usually do it in about 2 hours</p>
      <p>Thank you, {PRODUCER_NAME}.</p>
    </div>
  );
}

export default ContactMessageSent;
