import React, { useReducer, useState } from 'react';
import ContactForm from '../../components/contact-form';
import './contact-form-container.scss';
import Input from '../../pages/auth-pages/input';
import AuthService from '../../services/auth-service';
import ContactMessageSent from '../../components/contact-message-sent';

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return {
        ...state,
        name: action.payload
      };
    case 'email':
      return {
        ...state,
        email: action.payload
      };
    case 'subject':
      return {
        ...state,
        subject: action.payload
      };
    case 'message':
      return {
        ...state,
        message: action.payload
      };
    default:
      return state;
  }
};

function ContactFormContainer() {
  const [formState, dispatch] = useReducer(reducer, {
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [error, setError] = useState(null);
  const [isSent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const onInputHandler = (e, actionType) => {
    dispatch({ type: actionType, payload: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const authService = new AuthService();
    setSending(true);
    authService
      .contact(formState.email, formState.subject, formState.name, formState.message)
      .then((res) => {
        setSent(true);
        setSending(false);
      })
      .catch((e) => {
        setError(e);
        setSending(false);
      });
  };

  return (
    <div className="main-page-contact bg-black">
      <div className="description">
        <h2>Contact</h2>
        <p>If you have any questions you can contact me via this form or directly using my socials.</p>
        <a href="youtube" target="_blank" className="youtube">
          <img
            width="40"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1200px-YouTube_full-color_icon_%282017%29.svg.png"
            alt="asd"
          />
          &nbsp; /cherriesby
        </a>
        <a href="instagram" className="instagram">
          <img
            width="30"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png"
            alt="asd"
          />
          &nbsp; /cherriesby
        </a>
        <a href="instagram" className="instagram">
          <img width="30" src="https://img.icons8.com/color/48/000000/twitter--v1.png" alt="twitter" />
          &nbsp; /cherriesby
        </a>
        <a href="instagram" className="instagram">
          <img width="30" src="https://img.icons8.com/fluent/48/000000/facebook-new.png" alt="twitter" />
          &nbsp; /cherriesby
        </a>
      </div>
      {isSent ? (
        <ContactMessageSent />
      ) : (
        <ContactForm sending={sending} error={error} onSubmitHandler={onSubmitHandler} onInputHandler={onInputHandler} />
      )}
    </div>
  );
}

export default ContactFormContainer;
