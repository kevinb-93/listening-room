import SpotifyWebApi from 'spotify-web-api-js';
import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState } from '../../types';
import {
    LocalStorageItemNames,
    setLocalStorage
} from '../../../../utils/local-storage';

interface Payload {
    spotifyToken: IdentityContextState['spotifyToken'];
    spotifyRefreshToken: IdentityContextState['spotifyRefreshToken'];
    spotifyExpirationDate: IdentityContextState['spotifyExpirationDate'];
}

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    const {
        spotifyToken,
        spotifyRefreshToken,
        spotifyExpirationDate
    } = payload;

    dispatch({
        type: IdentityReducerAction.spotifyLogin,
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
    state: IdentityContextState,
    payload: Payload
): IdentityContextState => {
    return {
        ...state,
        spotifyToken: payload.spotifyToken,
        spotifyRefreshToken: payload.spotifyRefreshToken,
        spotifyExpirationDate: payload.spotifyExpirationDate
    };
};

export const _ = {
    action,
    reducer
};
