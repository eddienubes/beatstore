import React, {useReducer, useState} from "react";
import "./contact-form.scss";
import PlaceholderAnimatedInput from "../placeholder-animated-input";
import SpinnerAudio from "../spinner-audio";

const ContactForm = (props) => {

    const {onSubmitHandler, onInputHandler, error, sending} = props;
    if (error) {
        return (<p>{error.message}</p>);
    }

    if (sending) {
        return (<SpinnerAudio/>);
    }

    return (
        <form className="contact-form" onSubmit={onSubmitHandler}>
            <div className="contact-info-block">
                <PlaceholderAnimatedInput className="name"
                                          name="name"
                                          wrapper="contact-input"
                                          required={true}
                                          text="Name"
                                          onInput={(e) => onInputHandler(e, 'name')}
                > </PlaceholderAnimatedInput>

                <PlaceholderAnimatedInput className="email"
                                          name="email"
                                          wrapper="contact-input"
                                          required={true}
                                          text="Email"
                                          type="email"
                                          aria-invalid={true}
                                          onInput={(e) => onInputHandler(e, 'email')}
                > </PlaceholderAnimatedInput>
            </div>
            <PlaceholderAnimatedInput className="subject"
                                      name="subject"
                                      required={true}
                                      text="Subject"
                                      onInput={(e) => onInputHandler(e, 'subject')}

            >
            </PlaceholderAnimatedInput>
            <PlaceholderAnimatedInput className="message"
                                      name="message"
                                      required={true}
                                      text="Message"
                                      textArea={true}
                                      onInput={(e) => onInputHandler(e, 'message')}
            > </PlaceholderAnimatedInput>

            <button type="submit" className="invert-button">SEND MESSAGE</button>
        </form>
    )
}


export default ContactForm;
