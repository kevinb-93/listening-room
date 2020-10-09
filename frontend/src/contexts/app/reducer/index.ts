import React from 'react';
import { _ as Drawer } from './drawer';
import { AppReducerActionPayload } from './types';
import { AppContextState } from '../types';

// Combine the actions from the sub-modules
export const actions = {
    drawer: Drawer.actions,
};

// Combine the reducers from sub-modules
export const reducers = {
    ...Drawer.reducers,
};

const Reducer = (state: AppContextState, action: AppReducerActionPayload<unknown>): AppContextState => {
    // first see if there's a reducer for this action
    if (reducers[action.type] === undefined) {
        // return current state
        return state;
    }

    // use the reducer to process this action and return the new state
    return reducers[action.type](state, action.payload);
};

const initialState: AppContextState = {
    isDrawerHidden: true,
};

/**
 * React Hook providing access to reducer
 */
export const __useAppReducer = () =>
    React.useReducer<React.Reducer<AppContextState, unknown>>(Reducer, { ...initialState });
