import { SpotifyReducerActionPayload, SpotifyReducerAction } from '../types';
import { SpotifyContextState } from '../../types';

type Payload = SpotifyApi.UserDevice['id'];

const action = (
    dispatch: React.Dispatch<SpotifyReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: SpotifyReducerAction.setActiveDevice,
        payload
    });
};

const reducer = (
    state: SpotifyContextState,
    payload: Payload
): SpotifyContextState => {
    return {
        ...state,
        activeDeviceId: payload
    };
};

export const _ = {
    action,
    reducer
};
