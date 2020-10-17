import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState, SpotifyIdentity } from '../../types';

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<SpotifyIdentity>>,
    identity: SpotifyIdentity
) => {
    dispatch({
        type: IdentityReducerAction.setSpotifyIdentity,
        payload: identity,
    });
};

const reducer = (
    state: IdentityContextState,
    payload: SpotifyIdentity
): IdentityContextState => {
    return {
        ...state,
        spotify: payload,
        loggedIn: true,
    };
};

export const _ = {
    action,
    reducer,
};
