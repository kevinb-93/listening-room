import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState } from '../../types';

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<null>>
) => {
    dispatch({
        type: IdentityReducerAction.logout,
        payload: null
    });

    localStorage.removeItem('ls_user');
};

const reducer = (state: IdentityContextState): IdentityContextState => {
    return {
        ...state,
        token: null,
        tokenExpirationDate: null
    };
};

export const _ = {
    action,
    reducer
};
