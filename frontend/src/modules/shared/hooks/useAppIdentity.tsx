import { useCallback, useMemo } from 'react';
import { useSpotifyIdentityContext } from '../../spotify/context/identity';
import { useUserIdentityContext } from '../../user/contexts/identity';
import { UserIdentityContextState } from '../../user/contexts/identity/types';
import { useUserProfileContext } from '../../user/contexts/profile';
import { User, UserRole } from '../../user/contexts/profile/types';

const isValidToken = (token: UserIdentityContextState['userToken']) => {
    return Boolean(token?.trim());
};

const isValidUserType = (role: User['role']) => {
    return Object.values(UserRole).includes(role);
};

const isValidHost = (role: User['role']) => {
    return role === UserRole.Admin;
};

interface ValidUser {
    userToken: UserIdentityContextState['userToken'];
    role: User['role'];
}

const isValidUser = ({ userToken, role }: ValidUser) => {
    if (!isValidToken(userToken) || !isValidUserType(role)) {
        return false;
    }

    if (role === UserRole.User) {
        return true;
    }

    return isValidHost(role);
};

const useAppIdentity = () => {
    const { userToken, userLogout } = useUserIdentityContext();
    const { user } = useUserProfileContext();
    const { spotifyLogout } = useSpotifyIdentityContext();

    const isLoggedIn = useMemo(() => {
        const userIsValid = isValidUser({
            userToken,
            role: user?.role
        });

        return userIsValid;
    }, [user?.role, userToken]);

    const logout = useCallback(() => {
        userLogout();
        spotifyLogout();
    }, [spotifyLogout, userLogout]);

    return { isLoggedIn, logout };
};

export default useAppIdentity;
