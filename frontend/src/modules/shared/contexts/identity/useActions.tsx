import { useCallback } from 'react';
import { actions } from './reducer';
import { baseUrl } from '../../config/api';
import { useApiRequest } from '../../hooks/api-hook';
import {
    IdentityContextInterface,
    IdentityContextState,
    User,
    UserType
} from './types';

const isValidToken = (token: IdentityContextState['token']) => {
    return Boolean(token?.trim());
};

const isValidUserType = (userType: User['userType']) => {
    return userType in UserType;
};

const isValidHost = (
    userType: User['userType'],
    spotifyToken: IdentityContextState['spotifyToken']
) => {
    return userType === UserType.Host && isValidToken(spotifyToken);
};

interface ValidUser {
    token: IdentityContextState['token'];
    spotifyToken: IdentityContextState['spotifyToken'];
    userType: User['userType'];
}

const isValidUser = ({ token, spotifyToken, userType }: ValidUser) => {
    if (!isValidToken(token) || !isValidUserType(userType)) {
        return false;
    }

    if (userType === UserType.Guest) {
        return true;
    }

    return isValidHost(userType, spotifyToken);
};

const useActions = (
    state: IdentityContextState,
    dispatch: React.Dispatch<unknown>
) => {
    const { sendRequest: sendLogoutRequest } = useApiRequest();

    const isLoggedIn = useCallback(() => {
        const userIsValid = isValidUser({
            token: state.token,
            userType: state.user?.userType,
            spotifyToken: state.spotifyToken
        });

        return userIsValid;
    }, [state.spotifyToken, state.token, state.user?.userType]);

    const login = useCallback<IdentityContextInterface['login']>(
        (token, refreshToken, user) =>
            actions.auth.login(dispatch, {
                token,
                refreshToken,
                user
            }),
        [dispatch]
    );

    const logout = useCallback(() => {
        actions.auth.logout(dispatch);
        sendLogoutRequest(`${baseUrl}/api/user/logout`, {
            method: 'DELETE',
            data: { refreshToken: state.refreshToken }
        });
    }, [dispatch, sendLogoutRequest, state.refreshToken]);

    const spotifyLogin = useCallback(
        (spotifyToken, spotifyRefreshToken, spotifyExpirationDate) =>
            actions.auth.spotifyLogin(dispatch, {
                spotifyToken,
                spotifyRefreshToken,
                spotifyExpirationDate
            }),
        [dispatch]
    );

    const setRestoreState = useCallback(
        state => {
            actions.auth.restoreState(dispatch, { restoreState: state });
        },
        [dispatch]
    );

    return { isLoggedIn, login, logout, spotifyLogin, setRestoreState };
};

export default useActions;
