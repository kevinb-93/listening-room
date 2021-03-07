import {
    SpotifyIdentityReducerActionPayload,
    SpotifyIdentityReducerAction
} from '../types';
import { SpotifyIdentityContextState } from '../../types';

interface Payload {
    restoreState: SpotifyIdentityContextState['isRestoring'];
}

const action = (
    dispatch: React.Dispatch<SpotifyIdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyIdentityReducerAction.restoreState,
        payload
    });
};

const reducer = (
    state: SpotifyIdentityContextState,
    { restoreState }: Payload
): SpotifyIdentityContextState => {
    return {
        ...state,
        isRestoring: restoreState
    };
};

export const _ = {
    action,
    reducer
};
