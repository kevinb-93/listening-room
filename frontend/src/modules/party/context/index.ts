import { Provider } from './provider';
import React from 'react';
import { PartyContext } from './context';

export const PartyContextProvider = Provider;

export const usePartyContext = () => React.useContext(PartyContext);
