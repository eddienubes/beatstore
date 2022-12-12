import React, { useReducer, useEffect, cloneElement } from 'react';
import { validate } from '../../../utils/validators';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return {
        ...state,
        value: action.payload,
        isValid: validate(action.payload, action.validators)
      };
    case 'BLUR':
      return {
        ...state,
        isTouched: true
      };
    default:
      return state;
  }
};

function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialValid || false,
    isTouched: false
  });
  const { id, onInput } = props;
  const { value, isValid, isTouched } = inputState;

  useEffect(() => {
    if (props.onInput) {
      props.onInput(props.id, inputState.value, inputState.isValid);
    }
  }, [id, onInput, isValid, value]);

  const onChangeHandler = (e) => {
    if (props.type === 'checkbox') {
      dispatch({ type: 'INPUT_CHANGE', payload: e.target.checked, validators: props.validators });
      props.onChangeHandler();
    } else {
      dispatch({ type: 'INPUT_CHANGE', payload: e.target.value, validators: props.validators });
    }
  };

  const onBlurHandler = () => {
    dispatch({ type: 'BLUR' });
  };

  const errorMsg = !isValid && isTouched ? <p className="input__error-msg">{props.errorText}</p> : null;

  if (props.component) {
    const clonedElement = cloneElement(props.component, {
      id: props.id,
      onChange: onChangeHandler,
      onBlur: onBlurHandler,
      name: props.name,
      placeholder: props.placeholder,
      type: props.type,
      value: inputState.value
    });

    return (
      <>
        {clonedElement}
        {errorMsg}
      </>
    );
  }

  return (
    <>
      <input
        id={props.id}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        name={props.name}
        placeholder={props.placeholder}
        type={props.type}
        value={inputState.value}
      />
      {errorMsg}
    </>
  );
}

export default Input;
