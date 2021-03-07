import React from 'react';
import { PartyContextInterface } from './types';

export const PartyContext = React.createContext<PartyContextInterface>(
    Object.create(null)
);
