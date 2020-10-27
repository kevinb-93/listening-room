import { Provider } from './provider';
import React from 'react';
import { SpotifyContext } from './context';

export const SpotifyContextProvider = Provider;

export const useSpotifyContext = () => React.useContext(SpotifyContext);
