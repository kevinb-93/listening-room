import React from 'react';
import { IdentityContextInterface } from './types';

export const IdentityContext = React.createContext<IdentityContextInterface>(
    Object.create(null)
);
