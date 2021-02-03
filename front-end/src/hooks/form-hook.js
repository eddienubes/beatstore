import {useCallback, useReducer} from "react";

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (let inputId in state.inputs) {
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                }
                else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }

            if (state.confirmed !== undefined) {
                const {password, confirmedPassword} = state.inputs;
                let confirmed = true;

                if (action.inputId === 'password') {
                    confirmed = confirmed &&
                        action.value === confirmedPassword.value &&
                        action.value && confirmedPassword.isValid;
                }
                if (action.inputId === 'confirmedPassword') {
                    confirmed = confirmed &&
                        action.value === password.value &&
                        action.value && password.isValid;
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
                }
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
            }
        default:
            return state;
    }
}

const useForm = (initialInputs, initialFormValidity, initialConfirmed) => {
    let initialState;
    if (initialConfirmed !== undefined) {
        initialState = {
            inputs: initialInputs,
            isValid: initialFormValidity,
            confirmed: initialConfirmed
        };
    }
    else {
        initialState = {
            inputs: initialInputs,
            isValid: initialFormValidity,
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

    return [formState, onInputHandler];
}

export default useForm;