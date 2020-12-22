import { Provider } from './provider';
import React from 'react';
import { SpotifyIdentityContext } from './context';

export const SpotifyIdentityContextProvider = Provider;

export const useSpotifyIdentityContext = () =>
    React.useContext(SpotifyIdentityContext);
