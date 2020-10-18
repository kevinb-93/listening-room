import { useCallback, useReducer } from 'react';
import { InputValue } from '../components/FormElements/input';

interface FormReducerState {
    inputs: FormInputs;
    isValid: boolean;
}

interface FormReducerAction {
    type: FormReducerActionTypes;
    inputId?: string;
    isValid?: boolean;
    value?: InputValue;
    inputs?: FormInputs;
    formIsValid?: boolean;
}

enum FormReducerActionTypes {
    InputChange,
    SetData,
}

const formReducer = (state: FormReducerState, action: FormReducerAction) => {
    switch (action.type) {
        case FormReducerActionTypes.InputChange: {
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }

            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid,
                    },
                },
                isValid: formIsValid,
            };
        }
        case FormReducerActionTypes.SetData:
            return {
                inputs: action.inputs,
                isValid: action.formIsValid,
            };
        default:
            return state;
    }
};

interface FormInputs {
    [FormInputName: string]: FormInput;
}

interface FormInput {
    value: InputValue;
    isValid: boolean;
}

export const useForm = (
    initialInputs: FormInputs,
    initialFormValidity: boolean
) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    const inputHandler = useCallback(
        (id: string, value: InputValue, isValid: boolean) => {
            dispatch({
                type: FormReducerActionTypes.InputChange,
                value: value,
                isValid: isValid,
                inputId: id,
            });
        },
        []
    );

    const setFormData = useCallback(
        (inputData: FormInputs, formValidity: boolean) => {
            dispatch({
                type: FormReducerActionTypes.SetData,
                inputs: inputData,
                formIsValid: formValidity,
            });
        },
        []
    );

    return [formState, inputHandler, setFormData] as const;
};
