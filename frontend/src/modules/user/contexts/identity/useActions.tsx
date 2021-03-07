import { useCallback } from 'react';
import { actions } from './reducer';
import { baseUrl } from '../../../shared/config/api';
import { useApiRequest } from '../../../shared/hooks/use-api-request';
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

    const userLogout = useCallback(async () => {
        try {
            await sendLogoutRequest(`${baseUrl}/api/user/logout`, {
                method: 'DELETE',
                data: { refreshToken: state.userRefreshToken }
            });
        } catch (e) {
            console.log(e);
        } finally {
            actions.auth.logout(dispatch);
        }
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
