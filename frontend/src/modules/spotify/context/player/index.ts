import React from 'react';
import { SpotifyPlayerContextInterface } from './types';

export const useSpotifyPlayerContext = () =>
    React.useContext(SpotifyPlayerContext);

const SpotifyPlayerContext = React.createContext<SpotifyPlayerContextInterface>(
    Object.create(null)
);

export default SpotifyPlayerContext;
