import { useCallback } from 'react';
import { baseUrl } from '../../../shared/config/api';
import { useApiRequest } from '../../../shared/hooks/use-api-request';
import { UserIdentityContextState } from './types';
import {
    IdentityReducerAction,
    IdentityReducerActionType
} from './reducer/types';

const useActions = (
    state: UserIdentityContextState,
    dispatch: React.Dispatch<IdentityReducerAction>
) => {
    const { sendRequest: sendLogoutRequest } = useApiRequest();
    const userLogout = useCallback(async () => {
        try {
            await sendLogoutRequest(`${baseUrl}/api/user/logout`, {
                method: 'DELETE'
            });
        } catch (e) {
            console.log(e);
        } finally {
            dispatch({
                type: IdentityReducerActionType.userLogout,
                payload: null
            });
        }
    }, [dispatch, sendLogoutRequest]);

    const setRestoreState = useCallback(
        state => {
            dispatch({
                type: IdentityReducerActionType.restoreState,
                payload: { restoreState: state }
            });
        },
        [dispatch]
    );

    return { userLogout, setRestoreState };
};

export default useActions;
