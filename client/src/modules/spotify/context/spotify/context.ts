import React from 'react';
import { SpotifyContextInterface } from './types';

export const SpotifyContext = React.createContext<SpotifyContextInterface>(
    Object.create(null)
);
