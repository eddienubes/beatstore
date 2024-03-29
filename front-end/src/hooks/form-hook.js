import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  let formIsValid = true;

  switch (action.type) {
    case 'INPUT_CHANGE':
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      if (state.confirmed !== undefined) {
        const { password, confirmedPassword } = state.inputs;
        let confirmed = true;

        if (action.inputId === 'password') {
          confirmed = confirmed && action.value === confirmedPassword.value && action.value && confirmedPassword.isValid;
        }
        if (action.inputId === 'confirmedPassword') {
          confirmed = confirmed && action.value === password.value && action.value && password.isValid;
        }

        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: {
              value: action.value,
              isValid: action.isValid
            }
          },
          isValid: formIsValid,
          confirmed
        };
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid
          }
        },
        isValid: formIsValid
      };
    case 'SET_DATA':
      if (action.confirmed !== undefined) {
        return {
          inputs: action.inputs,
          isValid: action.isValid,
          confirmed: action.confirmed
        };
      }

      return {
        inputs: action.inputs,
        isValid: action.isValid
      };

    default:
      return state;
  }
};

const useForm = (initialInputs, initialFormValidity, initialConfirmed) => {
  let initialState;
  if (initialConfirmed !== undefined) {
    initialState = {
      inputs: initialInputs,
      isValid: initialFormValidity,
      confirmed: initialConfirmed
    };
  } else {
    initialState = {
      inputs: initialInputs,
      isValid: initialFormValidity
    };
  }

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const onInputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value,
      isValid,
      inputId: id
    });
  }, []);

  const setFormData = useCallback((inputData, initialFormValidity, initialConfirmed) => {
    if (initialConfirmed !== undefined) {
      dispatch({
        type: 'SET_DATA',
        inputs: inputData,
        isValid: initialFormValidity,
        confirmed: initialConfirmed
      });
    } else {
      dispatch({
        type: 'SET_DATA',
        inputs: inputData,
        isValid: initialFormValidity
      });
    }
  }, []);
  return [formState, onInputHandler, setFormData];
};

export default useForm;
