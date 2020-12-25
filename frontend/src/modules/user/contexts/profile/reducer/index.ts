import React from 'react';
import { _ as Profile } from './profile';
import { ActionPayload, UserProfileReducerActionPayload } from './types';
import { UserProfileContextState } from '../types';

// Combine the actions from the sub-modules
export const actions = {
    profile: Profile.actions
};

// Combine the reducers from sub-modules
export const reducers = {
    ...Profile.reducers
};

const Reducer = (
    state: UserProfileContextState,
    action: UserProfileReducerActionPayload<ActionPayload>
): UserProfileContextState => {
    if (reducers[action.type] === undefined) {
        return state;
    }

    return reducers[action.type](state, action.payload);
};

const initialState: UserProfileContextState = {
    userProfile: null
};

export const __useUserProfileReducer = () =>
    React.useReducer<React.Reducer<UserProfileContextState, unknown>>(Reducer, {
        ...initialState
    });
