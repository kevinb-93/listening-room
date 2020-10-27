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

    if (action === 'add') {
        queue = [...state.queue, ...tracks];
    } else if (action === 'delete') {
        queue = state.queue.filter((q) => !tracks.includes(q));
    }

    return {
        ...state,
        queue,
    };
};

export const _ = {
    action,
    reducer,
};
