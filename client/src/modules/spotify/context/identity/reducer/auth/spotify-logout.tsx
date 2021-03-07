import {
    SpotifyIdentityReducerActionPayload,
    SpotifyIdentityReducerAction
} from '../types';
import { SpotifyIdentityContextState } from '../../types';
import {
    LocalStorageItemNames,
    removeLocalStorage
} from '../../../../../shared/utils/local-storage';

const action = (
    dispatch: React.Dispatch<SpotifyIdentityReducerActionPayload<null>>
) => {
    dispatch({
        type: SpotifyIdentityReducerAction.spotifyLogout,
        payload: null
    });

    removeLocalStorage(LocalStorageItemNames.Spotify);
};

const reducer = (
    state: SpotifyIdentityContextState
): SpotifyIdentityContextState => {
    return {
        ...state,
        spotifyToken: null,
        spotifyRefreshToken: null,
        spotifyExpirationDate: null
    };
};

export const _ = {
    action,
    reducer
};
