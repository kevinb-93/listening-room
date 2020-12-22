import { useCallback } from 'react';
import { useSpotifyIdentityContext } from '../../spotify/context/identity';
import { SpotifyIdentityContextState } from '../../spotify/context/identity/types';
import { useUserIdentityContext } from '../contexts/identity';
import {
    UserIdentityContextState,
    User,
    UserType
} from '../contexts/identity/types';

const isValidToken = (token: UserIdentityContextState['userToken']) => {
    return Boolean(token?.trim());
};

const isValidUserType = (userType: User['userType']) => {
    return userType in UserType;
};

const isValidHost = (
    userType: User['userType'],
    spotifyToken: SpotifyIdentityContextState['spotifyToken']
) => {
    return userType === UserType.Host && isValidToken(spotifyToken);
};

interface ValidUser {
    userToken: UserIdentityContextState['userToken'];
    spotifyToken: SpotifyIdentityContextState['spotifyToken'];
    userType: User['userType'];
}

const isValidUser = ({ userToken, spotifyToken, userType }: ValidUser) => {
    if (!isValidToken(userToken) || !isValidUserType(userType)) {
        return false;
    }

    if (userType === UserType.Guest) {
        return true;
    }

    return isValidHost(userType, spotifyToken);
};

const useAppIdentity = () => {
    const { userToken, user, userLogout } = useUserIdentityContext();
    const { spotifyToken, spotifyLogout } = useSpotifyIdentityContext();

    const isLoggedIn = useCallback(() => {
        const userIsValid = isValidUser({
            userToken,
            userType: user?.userType,
            spotifyToken
        });

        return userIsValid;
    }, [spotifyToken, user?.userType, userToken]);

    const logout = useCallback(() => {
        userLogout();
        spotifyLogout();
    }, [spotifyLogout, userLogout]);

    return { isLoggedIn, logout };
};

export default useAppIdentity;
