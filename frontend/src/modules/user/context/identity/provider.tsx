import React from 'react';
import { IdentityContext } from './context';
import { IdentityContextInterface } from './types';
import { __useIdentityReducer, actions } from './reducer';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useIdentityReducer();

    const value: IdentityContextInterface = {
        ...state,
        actions: {
            setSpotifyIdentity: (identity) =>
                actions.spotify.set(dispatch, identity),
        },
    };

    return (
        <IdentityContext.Provider value={value}>
            {children}
        </IdentityContext.Provider>
    );
};
