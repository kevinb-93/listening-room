import { AppReducerActionPayload, AppReducerAction } from '../types';
import { AppContextState } from '../../types';

interface Payload {
    hideDrawer: boolean;
}

const action = (dispatch: React.Dispatch<AppReducerActionPayload<Payload>>, hideDrawer: boolean) => {
    dispatch({ type: AppReducerAction.hideDrawer, payload: { hideDrawer } });
};

const reducer = (state: AppContextState, { hideDrawer }: Payload): AppContextState => {
    return {
        ...state,
        isDrawerHidden: hideDrawer,
    };
};

export const _ = {
    action,
    reducer,
};
