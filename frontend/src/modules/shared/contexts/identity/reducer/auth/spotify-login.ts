import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState } from '../../types';

interface Payload {
    spotifyToken: IdentityContextState['spotifyToken'];
}

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: IdentityReducerAction.spotifyLogin,
        payload,
    });
};

const reducer = (
    state: IdentityContextState,
    payload: Payload
): IdentityContextState => {
    return {
        ...state,
        spotifyToken: payload.spotifyToken,
    };
};

export const _ = {
    action,
    reducer,
};
