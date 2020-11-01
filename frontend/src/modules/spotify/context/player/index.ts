import { Provider } from './provider';
import React from 'react';
import { SpotifyPlayerContext } from './context';

export const SpotifyPlayerContextProvider = Provider;

export const useSpotifyPlayerContext = () =>
    React.useContext(SpotifyPlayerContext);
