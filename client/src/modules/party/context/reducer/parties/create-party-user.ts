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
        type: PartyReducerAction.createPartyUser,
        payload
    });
};

const reducer = (
    state: PartyContextState,
    { partyId, userId }: Payload
): PartyContextState => {
    return {
        ...state,
        activeParty: partyId,
        parties: state.parties.map(p => {
            if (p.partyId !== partyId) {
                return p;
            }

            if (p.userIds.includes(userId)) {
                return p;
            }

            return {
                ...p,
                userIds: [...p.userIds, userId]
            };
        })
    };
};

export const _ = {
    action,
    reducer
};
