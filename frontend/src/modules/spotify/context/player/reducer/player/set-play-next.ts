import {
    SpotifyPlayerReducerActionPayload,
    SpotifyPlayerReducerAction
} from '../types';
import { SpotifyPlayerContextState } from '../../types';

type Payload = boolean;

const action = (
    dispatch: React.Dispatch<SpotifyPlayerReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyPlayerReducerAction.setPlayNext,
        payload
    });
};

const reducer = (
    state: SpotifyPlayerContextState,
    payload: Payload
): SpotifyPlayerContextState => {
    return {
        ...state,
        playNext: payload
    };
};

export const _ = {
    action,
    reducer
};
