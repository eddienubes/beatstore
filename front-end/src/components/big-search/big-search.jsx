import React, { useState } from 'react';
import './big-search.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { filter, filterSearchSet } from '../../redux/actions/actions';
import { PRODUCER_NAME } from '../../constants/content';

function BigSearch({ isMain = false }) {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.beatsReducer).filter;
  const history = useHistory();

  return (
    <div className="big-search">
      <h1 className="glitch" data-text={PRODUCER_NAME}>
        ${PRODUCER_NAME}
      </h1>
      <span className="sub">BEATSTORE</span>
      {/* <h1 className="logo">{PRODUCER NAME}</h1> */}
      <div className="search">
        <input
          placeholder="What type of track are you looking for?"
          id="search"
          type="search"
          autoComplete="off"
          value={formState.search}
          onChange={(e) => {
            setSearch(e.target.value);
            dispatch(filterSearchSet(e.target.value));

            if (!isMain) {
              dispatch(filter(undefined, Math.floor(window.innerHeight / 65)));
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && isMain) {
              history.push('/beats');
            } else if (!isMain && e.key === 'Enter') {
              dispatch(filter(undefined, Math.floor(window.innerHeight / 65)));
            }
          }}
        />
        <button
          className="search-magnifier-button"
          onClick={() => {
            setSearch(formState.search);
            if (search.length > 0) {
              if (isMain) {
                history.push('/beats');
              } else if (!isMain) {
                dispatch(filter(undefined, Math.floor(window.innerHeight / 65)));
              }
            }
          }}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
}

export default BigSearch;
