import { PartyContextState } from '../types';

export enum PartyReducerAction {
    createParty,
    deleteParty,
    createPartyUser,
    deletePartyUser
}

export interface PartyReducerActionPayload<T> {
    type: PartyReducerAction;
    payload: T;
}

export interface PartyReducer {
    (state: PartyContextState, payload: unknown): PartyContextState;
}

export interface PartyReducerMap {
    [key: string]: PartyReducer;
}
