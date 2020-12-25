import React from 'react';
import { _ as Auth } from './auth';
import { UserIdentityReducerActionPayload } from './types';
import { UserIdentityContextState } from '../types';

// Combine the actions from the sub-modules
export const actions = {
    auth: Auth.actions
};

// Combine the reducers from sub-modules
export const reducers = {
    ...Auth.reducers
};

const Reducer = (
    state: UserIdentityContextState,
    action: UserIdentityReducerActionPayload<unknown>
): UserIdentityContextState => {
    if (reducers[action.type] === undefined) {
        return state;
    }

    return reducers[action.type](state, action.payload);
};

const initialState: UserIdentityContextState = {
    userToken: null,
    isRestoring: true,
    userRefreshToken: null
};

export const __useUserIdentityReducer = () =>
    React.useReducer<React.Reducer<UserIdentityContextState, unknown>>(
        Reducer,
        {
            ...initialState
        }
    );
