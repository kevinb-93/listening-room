import React from 'react';
import {
    UserProfileReducerAction,
    UserProfileReducerActionType
} from './types';
import { UserProfileContextState } from '../types';

const Reducer = (
    state: UserProfileContextState,
    action: UserProfileReducerAction
): UserProfileContextState => {
    switch (action.type) {
        case UserProfileReducerActionType.SetProfile: {
            return {
                ...state,
                user: action.payload
            };
        }
        default: {
            return { ...state };
        }
    }
};

const initialState: UserProfileContextState = {
    user: Object.create(null)
};

export const __useUserProfileReducer = () =>
    React.useReducer(Reducer, {
        ...initialState
    });
