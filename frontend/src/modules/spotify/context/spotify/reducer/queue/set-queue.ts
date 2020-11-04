import { SpotifyReducerActionPayload, SpotifyReducerAction } from '../types';
import { SetSpotifyQueueParams, SpotifyContextState } from '../../types';

type Payload = SetSpotifyQueueParams;

const action = (
    dispatch: React.Dispatch<SpotifyReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyReducerAction.setQueue,
        payload,
    });
};

const reducer = (
    state: SpotifyContextState,
    { action, tracks }: Payload
): SpotifyContextState => {
    let queue: SpotifyContextState['queue'];
    const trackIds: SpotifyApi.TrackObjectFull['id'][] = tracks.map(
        (t) => t.id
    );

    if (action === 'add') {
        queue = [
            ...state.queue,
            ...tracks.filter((t) => !state.queue.includes(t)),
        ];
    } else if (action === 'delete') {
        queue = state.queue.filter((q) => !trackIds.includes(q.id));
    }

    localStorage.setItem('ls_queue', JSON.stringify(queue));

    return {
        ...state,
        queue,
    };
};

export const _ = {
    action,
    reducer,
};
