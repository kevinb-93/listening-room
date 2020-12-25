import { useCallback } from 'react';

import { actions } from './reducer';
import {
    UserProfile,
    UserProfileContextActions,
    UserProfileContextState
} from './types';

const useActions = (
    state: UserProfileContextState,
    dispatch: React.Dispatch<unknown>
): UserProfileContextActions => {
    const set = useCallback(
        (payload: UserProfile) => {
            actions.profile.set(dispatch, payload);
        },
        [dispatch]
    );

    return { set };
};

export default useActions;
