import React from 'react';
import { IdentityReducer, IdentityReducerActionType } from './types';
import { UserIdentityContextState } from '../types';
import {
    setLocalStorage,
    LocalStorageItemNames,
    removeLocalStorage
} from '../../../../shared/utils/local-storage';

const Reducer: IdentityReducer = (state, action) => {
    switch (action.type) {
        case IdentityReducerActionType.userLogin: {
            const { userToken } = action.payload;
            setLocalStorage(LocalStorageItemNames.User, {
                userToken
            });
            return {
                ...state,
                userToken,
                isRestoring: false
            };
        }
        case IdentityReducerActionType.userLogout: {
            removeLocalStorage(LocalStorageItemNames.User);
            return {
                ...state,
                userToken: '',
                isRestoring: false
            };
        }
        case IdentityReducerActionType.restoreState: {
            return {
                ...state,
                isRestoring: action.payload.restoreState
            };
        }
        default:
            return { ...state };
    }
};

const initialState: UserIdentityContextState = {
    userToken: '',
    isRestoring: true
};

export const __useUserIdentityReducer = () =>
    React.useReducer(Reducer, {
        ...initialState
    });
