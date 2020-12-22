import {
    UserIdentityReducerActionPayload,
    UserIdentityReducerAction
} from '../types';
import { UserIdentityContextState } from '../../types';
import {
    LocalStorageItemNames,
    removeLocalStorage
} from '../../../../utils/local-storage';

const action = (
    dispatch: React.Dispatch<UserIdentityReducerActionPayload<null>>
) => {
    dispatch({
        type: UserIdentityReducerAction.userLogout,
        payload: null
    });

    removeLocalStorage(LocalStorageItemNames.User);
};

const reducer = (state: UserIdentityContextState): UserIdentityContextState => {
    return {
        ...state,
        userToken: null,
        userRefreshToken: null,
        user: null,
        isRestoring: false
    };
};

export const _ = {
    action,
    reducer
};
