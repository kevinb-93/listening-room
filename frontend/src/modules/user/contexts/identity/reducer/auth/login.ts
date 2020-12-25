import {
    UserIdentityReducerActionPayload,
    UserIdentityReducerAction
} from '../types';
import { UserIdentityContextState } from '../../types';
import {
    LocalStorageItemNames,
    setLocalStorage
} from '../../../../../shared/utils/local-storage';

interface Payload {
    userToken: UserIdentityContextState['userToken'];
    userRefreshToken: UserIdentityContextState['userRefreshToken'];
}

const action = (
    dispatch: React.Dispatch<UserIdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: UserIdentityReducerAction.userLogin,
        payload
    });

    const { userToken, userRefreshToken } = payload;
    setLocalStorage(LocalStorageItemNames.User, {
        userToken,
        userRefreshToken
    });
};

const reducer = (
    state: UserIdentityContextState,
    { userToken, userRefreshToken }: Payload
): UserIdentityContextState => {
    return {
        ...state,
        userToken,
        userRefreshToken,
        isRestoring: false
    };
};

export const _ = {
    action,
    reducer
};
