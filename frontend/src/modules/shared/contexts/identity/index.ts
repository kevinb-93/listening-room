import { Provider } from './provider';
import React from 'react';
import { IdentityContext } from './context';

export const IdentityContextProvider = Provider;

export const useIdentityContext = () => React.useContext(IdentityContext);
