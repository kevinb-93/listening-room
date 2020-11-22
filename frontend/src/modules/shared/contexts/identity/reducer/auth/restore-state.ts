import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState } from '../../types';

interface Payload {
    restoreState: IdentityContextState['isRestoring'];
}

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: IdentityReducerAction.restoreState,
        payload
    });
};

const reducer = (
    state: IdentityContextState,
    { restoreState }: Payload
): IdentityContextState => {
    return {
        ...state,
        isRestoring: restoreState
    };
};

export const _ = {
    action,
    reducer
};
