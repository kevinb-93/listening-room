import React from 'react';
import { SpotifyContext } from './context';
import { SpotifyContextInterface } from './types';
import { __useSpotifyReducer, actions } from './reducer';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyReducer();

    const value: SpotifyContextInterface = {
        ...state,
        actions: {
            setQueue: (params) => actions.queue.setQueue(dispatch, params),
        },
    };

    return (
        <SpotifyContext.Provider value={value}>
            {children}
        </SpotifyContext.Provider>
    );
};
