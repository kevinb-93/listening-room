import React from 'react';
import { UserIdentityContextInterface } from './types';

export const UserIdentityContext = React.createContext<
    UserIdentityContextInterface
>(Object.create(null));
