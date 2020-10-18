import React, { useReducer, useEffect, ChangeEvent } from 'react';

import { validate, Validator } from '../../utils/validators';

export type InputValue = string | number | readonly string[];

interface InputReducerState {
    value: InputValue;
    isValid: boolean;
    isTouched: boolean;
}

interface InputReducerAction {
    type: InputReducerActionTypes;
    val?: string;
    validators?: Validator[];
}

enum InputReducerActionTypes {
    touch,
    change,
}

const inputReducer = (state: InputReducerState, action: InputReducerAction) => {
    switch (action.type) {
        case InputReducerActionTypes.change:
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators),
            };
        case InputReducerActionTypes.touch: {
            return {
                ...state,
                isTouched: true,
            };
        }
        default:
            return state;
    }
};

interface Props {
    id: string;
    onInput: (id: string, value: InputValue, isValid: boolean) => void;
    initialValue?: string;
    initialValid?: boolean;
    element: 'input' | 'textarea';
    type: string;
    placeholder?: string;
    rows?: number;
    label: string;
    errorText: string;
    validators: Validator[];
}

const Input: React.FC<Props> = ({
    initialValue,
    initialValid,
    id,
    onInput,
    element,
    type,
    placeholder,
    rows,
    label,
    errorText,
    validators,
}) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: initialValue,
        isTouched: false,
        isValid: initialValid,
    });
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    const changeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        dispatch({
            type: InputReducerActionTypes.change,
            val: event.target.value,
            validators: validators,
        });
    };

    const touchHandler = () => {
        dispatch({
            type: InputReducerActionTypes.touch,
        });
    };

    const inputElement =
        element === 'input' ? (
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
            />
        ) : (
            <textarea
                id={id}
                rows={rows}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
            />
        );

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            {inputElement}
            {!inputState.isValid && inputState.isTouched && <p>{errorText}</p>}
        </div>
    );
};

Input.defaultProps = {
    rows: 3,
    initialValue: '',
    initialValid: false,
    placeholder: '',
};

export default Input;
