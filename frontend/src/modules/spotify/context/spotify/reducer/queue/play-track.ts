import { SpotifyReducerActionPayload, SpotifyReducerAction } from '../types';
import { SpotifyContextState } from '../../types';

type Payload = SpotifyApi.TrackObjectFull;

const action = (
    dispatch: React.Dispatch<SpotifyReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyReducerAction.playTrack,
        payload
    });
};

const reducer = (
    state: SpotifyContextState,
    payload: Payload
): SpotifyContextState => {
    const trackId = payload.id;

    const queue = state.queue.filter(q => trackId !== q.id);

    localStorage.setItem('ls_queue', JSON.stringify(queue));
    localStorage.setItem('ls_now_playing', JSON.stringify(payload));

    return {
        ...state,
        queue,
        nowPlaying: payload
    };
};

export const _ = {
    action,
    reducer
};
