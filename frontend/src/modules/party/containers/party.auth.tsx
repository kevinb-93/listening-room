import React, { useCallback, useEffect, useState } from 'react';
import { Snackbar, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Alert } from '@material-ui/lab';
import styled from 'styled-components';

import { useApiRequest } from '../../shared/hooks/use-api-request';
import { useUserIdentityContext } from '../../user/contexts/identity';
import { CreatePartySubmit } from '../components/party.form-create';
import { JoinPartySubmit } from '../components/party.form-join';
import { usePartyContext } from '../context';
import LoginForm, {
    LoginFormValues,
    LoginSubmit
} from '../../user/components/user.form-login';
import { AxiosResponse } from 'axios';

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

    const loginAnon = async () => {
        return await sendLoginRequest(`user/register`, {
            method: 'POST',
            data: { name: null, password: null, isAnonymous: true }
        });
    };

    const loginUser = async ({ name, password }: LoginFormValues) => {
        return await sendLoginRequest(`user/login`, {
            method: 'POST',
            data: { name, password }
        });
    };

    const loginHandler: LoginSubmit = async data => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let response: AxiosResponse<any>;

            if (data.anonymous) {
                response = await loginAnon();
            } else {
                response = await loginUser(data);
            }
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
