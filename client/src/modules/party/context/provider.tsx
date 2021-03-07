import React, { useCallback } from 'react';
import { PartyContext } from './context';
import { PartyContextInterface } from './types';
import { __usePartyReducer, actions } from './reducer';

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = __usePartyReducer();

    const createParty = useCallback<PartyContextInterface['createParty']>(
        party => {
            actions.parties.createParty(dispatch, party);
        },
        [dispatch]
    );

    const createPartyUser = useCallback<
        PartyContextInterface['createPartyUser']
    >(
        (userId, partyId) => {
            actions.parties.createPartyUser(dispatch, { userId, partyId });
        },
        [dispatch]
    );

    const deleteParty = useCallback<PartyContextInterface['deleteParty']>(
        partyId => {
            actions.parties.deleteParty(dispatch, { partyId });
        },
        [dispatch]
    );

    const deletePartyUser = useCallback<
        PartyContextInterface['deletePartyUser']
    >(
        (userId, partyId) => {
            actions.parties.deletePartyUser(dispatch, { userId, partyId });
        },
        [dispatch]
    );

    const value: PartyContextInterface = {
        ...state,
        createParty,
        createPartyUser,
        deleteParty,
        deletePartyUser
    };

    return (
        <PartyContext.Provider value={value}>{children}</PartyContext.Provider>
    );
};
