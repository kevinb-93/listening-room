import { _ as CreateParty } from './create-party';
import { _ as CreatePartyUser } from './create-party-user';
import { _ as DeleteParty } from './delete-party';
import { _ as DeletePartyUser } from './delete-party-user';
import { PartyReducerAction, PartyReducerMap } from '../types';

const reducers: PartyReducerMap = {
    [PartyReducerAction.createParty]: CreateParty.reducer,
    [PartyReducerAction.createPartyUser]: CreatePartyUser.reducer,
    [PartyReducerAction.deleteParty]: DeleteParty.reducer,
    [PartyReducerAction.deletePartyUser]: DeletePartyUser.reducer
};

const actions = {
    createParty: CreateParty.action,
    createPartyUser: CreatePartyUser.action,
    deleteParty: DeleteParty.action,
    deletePartyUser: DeletePartyUser.action
};

export const _ = {
    reducers,
    actions
};
