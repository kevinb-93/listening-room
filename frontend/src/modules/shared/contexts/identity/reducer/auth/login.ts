import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState, User } from '../../types';
import {
    LocalStorageItemNames,
    setLocalStorage
} from '../../../../utils/local-storage';

interface Payload {
    token: IdentityContextState['token'];
    refreshToken: IdentityContextState['refreshToken'];
    user: User;
}

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: IdentityReducerAction.login,
        payload
    });

    const { token, refreshToken } = payload;
    setLocalStorage(LocalStorageItemNames.User, { token, refreshToken });
};

const reducer = (
    state: IdentityContextState,
    { token, refreshToken, user }: Payload
): IdentityContextState => {
    return {
        ...state,
        token,
        refreshToken,
        user,
        isRestoring: false
    };
};

export const _ = {
    action,
    reducer
};
