import { Provider } from './provider';
import React from 'react';
import { UserIdentityContext } from './context';

export const UserIdentityContextProvider = Provider;

UserIdentityContextProvider.displayName = 'UserIdentityProvider';

export const useUserIdentityContext = () =>
    React.useContext(UserIdentityContext);
