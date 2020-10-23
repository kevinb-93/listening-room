import { IdentityReducerActionPayload, IdentityReducerAction } from '../types';
import { IdentityContextState } from '../../types';

interface Payload {
    token: IdentityContextState['token'];
    expirationDate: IdentityContextState['tokenExpirationDate'];
}

const action = (
    dispatch: React.Dispatch<IdentityReducerActionPayload<Payload>>,
    payload: Payload
) => {
    const tokenExpirationDate =
        payload.expirationDate ||
        new Date(new Date().getTime() + 1000 * 60 * 60);

    dispatch({
        type: IdentityReducerAction.login,
        payload: { ...payload, expirationDate: tokenExpirationDate },
    });

    localStorage.setItem(
        'ls_user',
        JSON.stringify({
            token: payload.token,
            expiration: tokenExpirationDate.toISOString(),
        })
    );
};

const reducer = (
    state: IdentityContextState,
    { token, expirationDate }: Payload
): IdentityContextState => {
    return {
        ...state,
        token,
        tokenExpirationDate: expirationDate,
    };
};

export const _ = {
    action,
    reducer,
};
