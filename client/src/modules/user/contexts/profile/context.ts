import React from 'react';
import { UserProfileContextInterface } from './types';

export const UserProfileContext = React.createContext<UserProfileContextInterface>(
    Object.create(null)
);

UserProfileContext.displayName = 'UserProfileContext';
