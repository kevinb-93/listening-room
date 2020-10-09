import { Provider } from './provider';
import React from 'react';
import { AppContext } from './context';

export const AppContextProvider = Provider;

export const useAppContext = () => React.useContext(AppContext);
