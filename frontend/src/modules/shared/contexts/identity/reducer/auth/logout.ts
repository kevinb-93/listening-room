import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState } from '../../types';
import {
    LocalStorageItemNames,
    removeLocalStorage
} from '../../../../utils/local-storage';

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<null>>
) => {
    dispatch({
        type: IdentityReducerAction.logout,
        payload: null
    });

    removeLocalStorage(LocalStorageItemNames.User);
    removeLocalStorage(LocalStorageItemNames.Spotify);
};

const reducer = (state: IdentityContextState): IdentityContextState => {
    return {
        ...state,
        token: null,
        refreshToken: null,
        spotifyToken: null,
        spotifyRefreshToken: null,
        spotifyExpirationDate: null,
        user: null,
        isRestoring: false
    };
};

export const _ = {
    action,
    reducer
};
