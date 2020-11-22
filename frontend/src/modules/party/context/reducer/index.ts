import React from 'react';
import { _ as Parties } from './parties';
import { PartyReducerActionPayload } from './types';
import { PartyContextState } from '../types';

// Combine the actions from the sub-modules
export const actions = {
    parties: Parties.actions
};

// Combine the reducers from sub-modules
export const reducers = {
    ...Parties.reducers
};

const Reducer = (
    state: PartyContextState,
    action: PartyReducerActionPayload<unknown>
): PartyContextState => {
    // first see if there's a reducer for this action
    if (reducers[action.type] === undefined) {
        // return current state
        return state;
    }

    // use the reducer to process this action and return the new state
    return reducers[action.type](state, action.payload);
};

const initialState: PartyContextState = {
    parties: [],
    activeParty: null
};

/**
 * React Hook providing access to reducer
 */
export const __usePartyReducer = () =>
    React.useReducer<React.Reducer<PartyContextState, unknown>>(Reducer, {
        ...initialState
    });
