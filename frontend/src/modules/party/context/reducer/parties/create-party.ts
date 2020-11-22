import { PartyReducerActionPayload, PartyReducerAction } from '../types';
import { Party, PartyContextState } from '../../types';

const action = (
    dispatch: React.Dispatch<PartyReducerActionPayload<Party>>,
    payload: Party
) => {
    dispatch({
        type: PartyReducerAction.createParty,
        payload
    });
};

const reducer = (
    state: PartyContextState,
    { partyId, hostId }: Party
): PartyContextState => {
    const partyExists =
        state.parties.findIndex(p => p.partyId === partyId) > -1;

    if (partyExists) {
        return state;
    }

    return {
        ...state,
        activeParty: partyId,
        parties: [...state.parties, { partyId, hostId, userIds: [partyId] }]
    };
};

export const _ = {
    action,
    reducer
};
