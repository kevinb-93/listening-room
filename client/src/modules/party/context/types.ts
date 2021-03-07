export interface PartyContextInterface extends PartyContextState {
    createParty: (partyParams: Party) => void;
    deleteParty: (partyId: Party['partyId']) => void;
    createPartyUser: (userId: string, partyId: Party['partyId']) => void;
    deletePartyUser: (userId: string, partyId: Party['partyId']) => void;
}

export interface Party {
    partyId: string;
    hostId: string;
    userIds: string[];
}

export interface PartyContextState {
    parties: Party[];
    activeParty: Party['partyId'];
}
