import { SpotifyReducerActionPayload, SpotifyReducerAction } from '../types';
import { SpotifyContextState } from '../../types';

type Payload = SpotifyApi.UserDevice[];

const action = (
    dispatch: React.Dispatch<SpotifyReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyReducerAction.setDevices,
        payload,
    });
};

const reducer = (
    state: SpotifyContextState,
    payload: Payload
): SpotifyContextState => {
    return {
        ...state,
        devices: payload,
    };
};

export const _ = {
    action,
    reducer,
};
