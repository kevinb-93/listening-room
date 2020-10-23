import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState } from '../../types';

interface Payload {
    spotifyToken: IdentityContextState['spotifyToken'];
    spotifyRefreshToken: IdentityContextState['spotifyRefreshToken'];
}

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: IdentityReducerAction.spotifyLogin,
        payload,
    });

    localStorage.get;

    localStorage.setItem(
        'ls_spotify',
        JSON.stringify({
            spotifyToken: payload.spotifyToken,
            spotifyRefreshToken: payload.spotifyRefreshToken,
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
    };
};

export const _ = {
    action,
    reducer,
};
