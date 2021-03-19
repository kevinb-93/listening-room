import React from 'react';
import { SpotifyIdentityContextInterface } from './types';

export const SpotifyIdentityContext = React.createContext<
    SpotifyIdentityContextInterface
>(Object.create(null));

SpotifyIdentityContext.displayName = 'SpotifyIdentityContext';
