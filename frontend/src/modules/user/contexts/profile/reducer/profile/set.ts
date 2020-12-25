import {
    UserProfileReducerActionPayload,
    UserProfileReducerAction
} from '../types';
import { UserProfileContextState } from '../../types';

export type SetProfilePayload = UserProfileContextState['userProfile'];

const action = (
    dispatch: React.Dispatch<
        UserProfileReducerActionPayload<SetProfilePayload>
    >,
    payload: SetProfilePayload
) => {
    dispatch({
        type: UserProfileReducerAction.Set,
        payload
    });
};

const reducer = (
    state: UserProfileContextState,
    userProfile: SetProfilePayload
): UserProfileContextState => {
    return {
        ...state,
        userProfile
    };
};

export const _ = {
    action,
    reducer
};
