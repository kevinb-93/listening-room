import React from 'react';
import { WebSocketContextInterface } from './types';

export const WebSocketContext = React.createContext<WebSocketContextInterface>(
    Object.create(null)
);
