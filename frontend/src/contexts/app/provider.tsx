import React from 'react';
import { AppContext } from './context';
import { AppContextInterface } from './types';
import { __useAppReducer, actions } from './reducer';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __useAppReducer();

    const value: AppContextInterface = {
        ...state,
        actions: {
            hideDrawer: (hide) => actions.drawer.hide(dispatch, hide),
        },
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
