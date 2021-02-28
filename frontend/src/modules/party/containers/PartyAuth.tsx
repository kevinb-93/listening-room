import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, Snackbar, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Alert } from '@material-ui/lab';
import styled from 'styled-components';

import { useApiRequest } from '../../shared/hooks/api-hook';
import { useUserIdentityContext } from '../../user/contexts/identity';
import CreatePartyForm, {
    CreatePartySubmit
} from '../components/CreatePartyForm';
import JoinPartyForm, {
    JoinPartySubmit,
    Party
} from '../components/JoinPartyForm';
import TabbedForm, {
    TabbedForms
} from '../../shared/components/FormElements/TabbedForm';
import { usePartyContext } from '../context';
import LoginForm, { LoginSubmit } from '../../user/components/LoginForm';

const TransitionUp = (props: TransitionProps) => (
    <Slide {...props} direction="up" />
);

const PartyAuth: React.FC = () => {
    const { userLogin } = useUserIdentityContext();
    const { createParty, createPartyUser } = usePartyContext();

    const { sendRequest, error, clearError } = useApiRequest();
    const {
        sendRequest: sendLoginRequest,
        error: loginError,
        clearError: clearLoginError
    } = useApiRequest();
    // const { sendRequest: getPartiesRequest } = useApiRequest();

    // const [partyList, setPartyList] = useState<Party[]>([]);

    // const handleFetchPartiesRequest = useCallback(async () => {
    //     try {
    //         const response = await getPartiesRequest(`party`, {});
    //         if (response.status === 200) {
    //             const parties = response.data.map((d: { _id: unknown }) => {
    //                 return { id: d._id, name: d._id };
    //             });
    //             setPartyList(parties);
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }, [getPartiesRequest]);

    // useEffect(
    //     function fetchParties() {
    //         handleFetchPartiesRequest();
    //     },
    //     [handleFetchPartiesRequest]
    // );

    useEffect(() => {
        document.title = 'Get the party started!';
    }, []);

    const createPartySubmitHandler: CreatePartySubmit = useCallback(
        async data => {
            try {
                const response = await sendRequest(`party/create`, {
                    data,
                    method: 'POST'
                });
                userLogin(
                    response.data.accessToken,
                    response.data.refreshToken
                );
                createParty({
                    partyId: response.data.partyId,
                    userIds: [response.data.userId],
                    hostId: response.data.userId
                });
            } catch (e) {
                throw new Error(e);
            }
        },
        [createParty, sendRequest, userLogin]
    );

    const joinPartySubmitHandler: JoinPartySubmit = useCallback(
        async data => {
            try {
                const response = await sendRequest(
                    `party/join/${data.partyCode}`,
                    {
                        method: 'POST',
                        data: {
                            partyId: data.partyCode
                            // TODO: user id
                        }
                    }
                );
                userLogin(
                    response.data.accessToken,
                    response.data.refreshToken
                );
                createPartyUser(response.data.userId, response.data.partyId);
            } catch (e) {
                throw new Error(e);
            }
        },
        [createPartyUser, sendRequest, userLogin]
    );

    const loginHandler: LoginSubmit = async data => {
        try {
            const response = await sendLoginRequest(`user/login`, {
                method: 'POST',
                data
            });
            if (response.status === 201) {
                userLogin(
                    response.data.accessToken,
                    response.data.refreshToken
                );
            }
        } catch (e) {
            console.error(e);
        }
    };

    const [showToastError, setShowToastError] = useState(error?.length > 0);

    useEffect(() => {
        if (error?.length > 0) {
            setShowToastError(true);
        }
    }, [error?.length]);

    const closeToastError = useCallback(() => {
        setShowToastError(false);
    }, []);

    return (
        <StyledContainer>
            <Snackbar
                TransitionComponent={TransitionUp}
                open={showToastError}
                onClose={closeToastError}
                onExited={clearError}
                autoHideDuration={6000}
            >
                <Alert
                    variant="filled"
                    severity="error"
                    onClose={closeToastError}
                >
                    {error}
                </Alert>
            </Snackbar>
            <StyledFormContainer>
                <LoginForm onSubmit={loginHandler} />
                {/* <JoinPartyForm onSubmit={joinPartySubmitHandler} /> */}
            </StyledFormContainer>
        </StyledContainer>
    );
};

const StyledContainer = styled.section`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const StyledFormContainer = styled.div`
    background-color: #fff;
    padding: 32px;
    border-radius: 32px;
    max-width: 500px;
`;

export default PartyAuth;
