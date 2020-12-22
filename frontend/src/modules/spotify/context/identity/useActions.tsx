import { useCallback } from 'react';
import { actions } from './reducer';

const useActions = (dispatch: React.Dispatch<unknown>) => {
    const spotifyLogin = useCallback(
        (spotifyToken, spotifyRefreshToken, spotifyExpirationDate) =>
            actions.auth.spotifyLogin(dispatch, {
                spotifyToken,
                spotifyRefreshToken,
                spotifyExpirationDate
            }),
        [dispatch]
    );

    const spotifyLogout = useCallback(() => {
        actions.auth.spotifyLogout(dispatch);
    }, [dispatch]);

    const setRestoreState = useCallback(
        state => {
            actions.auth.restoreState(dispatch, { restoreState: state });
        },
        [dispatch]
    );

    return { spotifyLogin, spotifyLogout, setRestoreState };
};

export default useActions;
