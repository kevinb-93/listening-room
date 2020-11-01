import {
    SpotifyPlayerReducerActionPayload,
    SpotifyPlayerReducerAction,
} from '../types';
import { SpotifyPlayerContextState } from '../../types';

type Payload = Spotify.WebPlaybackInstance;

const action = (
    dispatch: React.Dispatch<SpotifyPlayerReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyPlayerReducerAction.setPlayerInstance,
        payload,
    });
};

const reducer = (
    state: SpotifyPlayerContextState,
    payload: Payload
): SpotifyPlayerContextState => {
    return {
        ...state,
        playerInstance: payload,
    };
};

export const _ = {
    action,
    reducer,
};
