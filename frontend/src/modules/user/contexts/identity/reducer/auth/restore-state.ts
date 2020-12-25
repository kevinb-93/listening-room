import {
    UserIdentityReducerActionPayload,
    UserIdentityReducerAction
} from '../types';
import { UserIdentityContextState } from '../../types';

interface Payload {
    restoreState: UserIdentityContextState['isRestoring'];
}

const action = (
    dispatch: React.Dispatch<UserIdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: UserIdentityReducerAction.restoreState,
        payload
    });
};

const reducer = (
    state: UserIdentityContextState,
    { restoreState }: Payload
): UserIdentityContextState => {
    return {
        ...state,
        isRestoring: restoreState
    };
};

export const _ = {
    action,
    reducer
};
