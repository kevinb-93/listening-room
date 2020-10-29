import React, { useEffect } from 'react';
import { SpotifyContext } from './context';
import { SpotifyContextInterface, SpotifyContextState } from './types';
import { __useSpotifyReducer, actions } from './reducer';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useSpotifyReducer();

    const value: SpotifyContextInterface = {
        ...state,
        actions: {
            setQueue: (params) => actions.queue.setQueue(dispatch, params),
        },
    };

    useEffect(() => {
        const queue =
            JSON.parse(localStorage.getItem('s_queue')) ??
            ([] as SpotifyContextState['queue']);

        console.log(queue);

        actions.queue.setQueue(dispatch, {
            action: 'add',
            tracks: queue,
        });
    }, [dispatch]);

    return (
        <SpotifyContext.Provider value={value}>
            {children}
        </SpotifyContext.Provider>
    );
};
