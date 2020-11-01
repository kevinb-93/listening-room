import React from 'react';
import { SpotifyPlayerContextInterface } from './types';

export const SpotifyPlayerContext = React.createContext<
    SpotifyPlayerContextInterface
>(Object.create(null));
