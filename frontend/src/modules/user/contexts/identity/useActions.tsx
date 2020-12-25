import { useCallback } from 'react';
import { actions } from './reducer';
import { baseUrl } from '../../../shared/config/api';
import { useApiRequest } from '../../../shared/hooks/api-hook';
import {
    UserIdentityContextInterface,
    UserIdentityContextState
} from './types';

const useActions = (
    state: UserIdentityContextState,
    dispatch: React.Dispatch<unknown>
) => {
    const { sendRequest: sendLogoutRequest } = useApiRequest();

    const userLogin = useCallback<UserIdentityContextInterface['userLogin']>(
        (userToken, userRefreshToken) =>
            actions.auth.login(dispatch, {
                userToken,
                userRefreshToken
            }),
        [dispatch]
    );

    const userLogout = useCallback(() => {
        actions.auth.logout(dispatch);
        sendLogoutRequest(`${baseUrl}/api/user/logout`, {
            method: 'DELETE',
            data: { refreshToken: state.userRefreshToken }
        });
    }, [dispatch, sendLogoutRequest, state.userRefreshToken]);

    const setRestoreState = useCallback(
        state => {
            actions.auth.restoreState(dispatch, { restoreState: state });
        },
        [dispatch]
    );

    return { userLogin, userLogout, setRestoreState };
};

export default useActions;
