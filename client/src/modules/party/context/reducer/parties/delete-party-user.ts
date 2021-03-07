import { PartyReducerActionPayload, PartyReducerAction } from '../types';
import { Party, PartyContextState } from '../../types';

interface Payload {
    userId: string;
    partyId: Party['partyId'];
}

const action = (
    dispatch: React.Dispatch<PartyReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: PartyReducerAction.deletePartyUser,
        payload
    });
};

const reducer = (
    state: PartyContextState,
    { partyId, userId }: Payload
): PartyContextState => {
    return {
        ...state,
        parties: state.parties.map(p => {
            if (p.partyId !== partyId) {
                return p;
            }

            return {
                ...p,
                userIds: p.userIds.filter(uId => uId !== userId)
            };
        })
    };
};

export const _ = {
    action,
    reducer
};
