import { SpotifyReducerActionPayload, SpotifyReducerAction } from '../types';
import { SpotifyContextState } from '../../types';
import {
    LocalStorageItemNames,
    setLocalStorage
} from '../../../../../shared/utils/local-storage';

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

    setLocalStorage(LocalStorageItemNames.Queue, queue);
    setLocalStorage(LocalStorageItemNames.NowPlaying, payload);

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
