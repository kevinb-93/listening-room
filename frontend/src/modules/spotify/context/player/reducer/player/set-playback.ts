import {
    SpotifyPlayerReducerActionPayload,
    SpotifyPlayerReducerAction
} from '../types';
import { SpotifyPlayerContextState } from '../../types';

type Payload = Spotify.PlaybackState;

const action = (
    dispatch: React.Dispatch<SpotifyPlayerReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyPlayerReducerAction.setPlayback,
        payload
    });
};

const reducer = (
    state: SpotifyPlayerContextState,
    payload: Payload
): SpotifyPlayerContextState => {
    let playNext: SpotifyPlayerContextState['playNext'] = false;

    if (
        payload?.paused &&
        payload?.duration < state?.playbackState?.duration &&
        payload?.track_window?.current_track?.id ===
            state?.playbackState?.track_window?.current_track?.id
    ) {
        playNext = true;
    }

    return {
        ...state,
        playbackState: payload,
        playNext
    };
};

export const _ = {
    action,
    reducer
};
