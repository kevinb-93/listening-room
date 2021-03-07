import { Provider } from './provider';
import React from 'react';
import { UserProfileContext } from './context';

export const UserProfileContextProvider = Provider;

export const useUserProfileContext = () => React.useContext(UserProfileContext);
