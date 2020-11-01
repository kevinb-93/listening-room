import {
    SpotifyPlayerReducerActionPayload,
    SpotifyPlayerReducerAction,
} from '../types';
import { SpotifyPlayerContextState } from '../../types';

type Payload = Spotify.PlaybackState;

const action = (
    dispatch: React.Dispatch<SpotifyPlayerReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyPlayerReducerAction.setPlayback,
        payload,
    });
};

const reducer = (
    state: SpotifyPlayerContextState,
    payload: Payload
): SpotifyPlayerContextState => {
    return {
        ...state,
        playbackState: payload,
    };
};

export const _ = {
    action,
    reducer,
};
