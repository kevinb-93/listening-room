import SpotifyWebApi from 'spotify-web-api-js';
import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState } from '../../types';

interface Payload {
    spotifyToken: IdentityContextState['spotifyToken'];
    spotifyRefreshToken: IdentityContextState['spotifyRefreshToken'];
    spotifyExpirationDate: IdentityContextState['spotifyExpirationDate'];
}

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: IdentityReducerAction.spotifyLogin,
        payload: {
            ...payload,
            spotifyExpirationDate: payload.spotifyExpirationDate,
        },
    });

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(payload.spotifyToken);

    localStorage.setItem(
        'ls_spotify',
        JSON.stringify({
            spotifyToken: payload.spotifyToken,
            spotifyRefreshToken: payload.spotifyRefreshToken,
            spotifyExpirationDate: payload.spotifyExpirationDate.toISOString(),
        })
    );
};

const reducer = (
    state: IdentityContextState,
    payload: Payload
): IdentityContextState => {
    return {
        ...state,
        spotifyToken: payload.spotifyToken,
        spotifyRefreshToken: payload.spotifyRefreshToken,
        spotifyExpirationDate: payload.spotifyExpirationDate,
    };
};

export const _ = {
    action,
    reducer,
};
