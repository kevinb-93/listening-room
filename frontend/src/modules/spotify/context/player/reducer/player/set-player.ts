import {
    SpotifyPlayerReducerActionPayload,
    SpotifyPlayerReducerAction
} from '../types';
import { SpotifyPlayerContextState } from '../../types';

type Payload = Spotify.SpotifyPlayer;

const action = (
    dispatch: React.Dispatch<SpotifyPlayerReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyPlayerReducerAction.setPlayer,
        payload
    });
};

const reducer = (
    state: SpotifyPlayerContextState,
    payload: Payload
): SpotifyPlayerContextState => {
    return {
        ...state,
        player: payload
    };
};

export const _ = {
    action,
    reducer
};
