import { Provider } from './provider';
import React from 'react';
import { WebSocketContext } from './context';

export const WebSocketContextProvider = Provider;

export const useWebSocketContext = () => React.useContext(WebSocketContext);
