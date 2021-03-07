import SpotifyWebApi from 'spotify-web-api-js';
import {
    SpotifyIdentityReducerActionPayload,
    SpotifyIdentityReducerAction
} from '../types';
import { SpotifyIdentityContextState } from '../../types';
import {
    LocalStorageItemNames,
    setLocalStorage
} from '../../../../../shared/utils/local-storage';

interface Payload {
    spotifyToken: SpotifyIdentityContextState['spotifyToken'];
    spotifyRefreshToken: SpotifyIdentityContextState['spotifyRefreshToken'];
    spotifyExpirationDate: SpotifyIdentityContextState['spotifyExpirationDate'];
}

const action = (
    dispatch: React.Dispatch<SpotifyIdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    const {
        spotifyToken,
        spotifyRefreshToken,
        spotifyExpirationDate
    } = payload;

    dispatch({
        type: SpotifyIdentityReducerAction.spotifyLogin,
        payload
    });

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(spotifyToken);

    setLocalStorage(LocalStorageItemNames.Spotify, {
        spotifyToken,
        spotifyRefreshToken,
        spotifyExpirationDate
    });
};

const reducer = (
    state: SpotifyIdentityContextState,
    { spotifyToken, spotifyRefreshToken, spotifyExpirationDate }: Payload
): SpotifyIdentityContextState => {
    return {
        ...state,
        spotifyToken,
        spotifyRefreshToken,
        spotifyExpirationDate
    };
};

export const _ = {
    action,
    reducer
};
