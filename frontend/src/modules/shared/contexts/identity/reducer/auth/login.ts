import {
    UserIdentityReducerActionPayload,
    UserIdentityReducerAction
} from '../types';
import { UserIdentityContextState, User } from '../../types';
import {
    LocalStorageItemNames,
    setLocalStorage
} from '../../../../utils/local-storage';

interface Payload {
    userToken: UserIdentityContextState['userToken'];
    userRefreshToken: UserIdentityContextState['userRefreshToken'];
    user: User;
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
    { userToken, userRefreshToken, user }: Payload
): UserIdentityContextState => {
    return {
        ...state,
        userToken,
        userRefreshToken,
        user,
        isRestoring: false
    };
};

export const _ = {
    action,
    reducer
};
