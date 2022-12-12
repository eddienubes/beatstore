import React, { useReducer, useState } from 'react';
import './contact-form.scss';
import PlaceholderAnimatedInput from '../placeholder-animated-input';
import SpinnerAudio from '../spinner-audio';

function ContactForm(props) {
  const { onSubmitHandler, onInputHandler, error, sending } = props;
  if (error) {
    return <p>{error.message}</p>;
  }

  if (sending) {
    return <SpinnerAudio />;
  }

  return (
    <form className="contact-form" onSubmit={onSubmitHandler}>
      <div className="contact-info-block">
        <PlaceholderAnimatedInput
          className="name"
          name="name"
          wrapper="contact-input"
          required
          text="Name"
          onInput={(e) => onInputHandler(e, 'name')}
        />

        <PlaceholderAnimatedInput
          className="email"
          name="email"
          wrapper="contact-input"
          required
          text="Email"
          type="email"
          aria-invalid
          onInput={(e) => onInputHandler(e, 'email')}
        />
      </div>
      <PlaceholderAnimatedInput
        className="subject"
        name="subject"
        required
        text="Subject"
        onInput={(e) => onInputHandler(e, 'subject')}
      />
      <PlaceholderAnimatedInput
        className="message"
        name="message"
        required
        text="Message"
        textArea
        onInput={(e) => onInputHandler(e, 'message')}
      />

      <button type="submit" className="invert-button">
        SEND MESSAGE
      </button>
    </form>
  );
}

export default ContactForm;
