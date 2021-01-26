import React from "react";
import "./contact-form.scss";
import PlaceholderAnimatedButton from "../placeholder-animated-button";

const ContactForm = () => {

    // todo add validation
    // todo add textarea instead of input message
    return (
        <form className="contact-form">
            <div className="contact-info-block">
                <PlaceholderAnimatedButton className="name"
                                           name="name"
                                           wrapper="contact-input"
                                           required={true}
                                           text="Name"> </PlaceholderAnimatedButton>

                <PlaceholderAnimatedButton className="email"
                                           name="email"
                                           wrapper="contact-input"
                                           required={true}
                                           text="Email"> </PlaceholderAnimatedButton>
            </div>
            <PlaceholderAnimatedButton className="subject"
                                       name="subject"
                                       required={true}
                                       text="Subject"> </PlaceholderAnimatedButton>
            <PlaceholderAnimatedButton className="message"
                                       name="message"
                                       required={true}
                                       text="Message"> </PlaceholderAnimatedButton>

            <button type="submit" className="invert-button" >SEND MESSAGE</button>
        </form>
    )
}



export default ContactForm;
