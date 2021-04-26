import { useCallback, useMemo } from 'react';
import { useSpotifyIdentityContext } from '../../spotify/context/identity';
import { useUserIdentityContext } from '../../user/contexts/identity';
import { UserIdentityContextState } from '../../user/contexts/identity/types';

interface ValidUser {
    userToken: UserIdentityContextState['userToken'];
}

const isValidUser = ({ userToken }: ValidUser) => {
    return Boolean(userToken);
};

const useAppIdentity = () => {
    const { userToken, userLogout } = useUserIdentityContext();
    const { logoutSpotify } = useSpotifyIdentityContext();

    const isLoggedIn = useMemo(() => {
        const userIsValid = isValidUser({
            userToken
        });

        return userIsValid;
    }, [userToken]);

    const logout = useCallback(() => {
        userLogout();
        logoutSpotify();
    }, [logoutSpotify, userLogout]);

    return { isLoggedIn, logout };
};

export default useAppIdentity;
