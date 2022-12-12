import React, { useState } from 'react';
import './comment-input.scss';
import { Input } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import user from '../comment-section/user.png';
import SpinnerAudio from '../spinner-audio';
import ErrorIndicator from '../error-indicator';

function CommentInput({ beatId, handleSend }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id, loggedIn, token } = useSelector((state) => state.userReducer);
  const history = useHistory();

  const onHandleSend = (e) => {
    if (!loggedIn) {
      history.push('/auth/register');
      return;
    }
    e.preventDefault();
    setValue('');
    handleSend(beatId, value, setError, setLoading, loading);
  };

  if (error) {
    return <ErrorIndicator />;
  }

  return (
    <div className="comment-input-wrapper">
      <div aria-selected="false" className="avatar">
        <img aria-selected="false" src={user} alt="user-icon" />
      </div>
      <form onSubmit={onHandleSend}>
        <Input type="text" placeholder="Write a comment..." action>
          <input required className="comment-input" maxLength={300} value={value} onChange={(e) => setValue(e.target.value)} />
          <p>
            {value.length}
            /300
          </p>
          {loading ? (
            <SpinnerAudio />
          ) : (
            <button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} /> SEND
            </button>
          )}
        </Input>
      </form>
    </div>
  );
}

export default CommentInput;
