import { PartyReducerActionPayload, PartyReducerAction } from '../types';
import { Party, PartyContextState } from '../../types';

interface Payload {
    partyId: Party['partyId'];
}

const action = (
    dispatch: React.Dispatch<PartyReducerActionPayload<Payload>>,
    payload: Payload
) => {
    dispatch({
        type: PartyReducerAction.deleteParty,
        payload
    });
};

const reducer = (
    state: PartyContextState,
    { partyId }: Payload
): PartyContextState => {
    return {
        ...state,
        parties: state.parties.filter(p => p.partyId !== partyId)
    };
};

export const _ = {
    action,
    reducer
};
