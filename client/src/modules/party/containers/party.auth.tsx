import React, {
    MouseEventHandler,
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    Snackbar,
    Slide,
    Paper,
    CardContent,
    Typography,
    Card,
    Container,
    Divider,
    Link
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Alert } from '@material-ui/lab';
import styled from 'styled-components';

import { useApiRequest } from '../../shared/hooks/use-api-request';
import { useUserIdentityContext } from '../../user/contexts/identity';
import { CreatePartySubmit } from '../components/party.form-create';
import { JoinPartySubmit } from '../components/party.form-join';
import LoginForm, {
    LoginFormValues,
    LoginSubmit
} from '../../user/components/user.form-login';
import { AxiosResponse } from 'axios';
import { IdentityReducerActionType } from '../../user/contexts/identity/reducer/types';

const TransitionUp = (props: TransitionProps) => (
    <Slide {...props} direction="up" />
);

const PartyAuth: React.FC = () => {
    const { dispatch } = useUserIdentityContext();
    // const { createParty, createPartyUser } = usePartyContext();

    const { sendRequest, error, clearError } = useApiRequest();
    const {
        sendRequest: sendLoginRequest,
        error: loginError,
        clearError: clearLoginError
    } = useApiRequest();

    useEffect(() => {
        document.title = 'Get the party started!';
    }, []);

    // const createPartySubmitHandler: CreatePartySubmit = useCallback(
    //     async data => {
    //         try {
    //             const response = await sendRequest(`party/create`, {
    //                 data,
    //                 method: 'POST'
    //             });
    //             dispatch({
    //                 type: IdentityReducerActionType.userLogin,
    //                 payload: { userToken: response.data.accessToken }
    //             });
    //             createParty({
    //                 partyId: response.data.partyId,
    //                 userIds: [response.data.userId],
    //                 hostId: response.data.userId
    //             });
    //         } catch (e) {
    //             throw new Error(e);
    //         }
    //     },
    //     [createParty, dispatch, sendRequest]
    // );

    // const joinPartySubmitHandler: JoinPartySubmit = useCallback(
    //     async data => {
    //         try {
    //             const response = await sendRequest(
    //                 `party/join/${data.partyCode}`,
    //                 {
    //                     method: 'POST',
    //                     data: {
    //                         partyId: data.partyCode
    //                         // TODO: user id
    //                     }
    //                 }
    //             );
    //             dispatch({
    //                 type: IdentityReducerActionType.userLogin,
    //                 payload: { userToken: response.data.accessToken }
    //             });
    //             createPartyUser(response.data.userId, response.data.partyId);
    //         } catch (e) {
    //             throw new Error(e);
    //         }
    //     },
    //     [createPartyUser, dispatch, sendRequest]
    // );

    const loginAnon = async () => {
        return await sendLoginRequest(`user/register`, {
            method: 'POST',
            data: { name: null, password: null, isAnonymous: true }
        });
    };

    const loginUser = async ({ name, password }: LoginFormValues) => {
        return await sendLoginRequest(`user/login`, {
            method: 'POST',
            data: { name, password },
            withCredentials: true
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
                dispatch({
                    type: IdentityReducerActionType.userLogin,
                    payload: { userToken: response.data.accessToken }
                });
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

    const preventDefault: MouseEventHandler<HTMLAnchorElement> = event =>
        event.preventDefault();

    return (
        <StyledSection>
            <StyledAuthContainer>
                {/* <Snackbar
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
                </Snackbar> */}
                <Card>
                    <StyledFormContent>
                        <StyledFormHeader>
                            <Typography variant="h4">Login</Typography>
                        </StyledFormHeader>
                        <LoginForm onSubmit={loginHandler} />
                        {loginError ? (
                            <StyledAlertSection>
                                <Alert severity="error">
                                    <b>{loginError}</b>
                                </Alert>
                            </StyledAlertSection>
                        ) : null}
                        <Divider />
                        <StyledOtherActionsSection>
                            <Link href="#" onClick={preventDefault}>
                                Create new account
                            </Link>
                        </StyledOtherActionsSection>
                    </StyledFormContent>
                </Card>
            </StyledAuthContainer>
        </StyledSection>
    );
};

const StyledSection = styled.section`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const StyledAuthContainer = styled(Container)`
    max-width: 600px;
    margin: 0 auto;
    padding: 80px 16px;
`;

const StyledFormContent = styled(CardContent)`
    padding: ${props => props.theme.spacing(4)}px;
`;

const StyledFormHeader = styled.div`
    margin-bottom: ${props => props.theme.spacing(3)}px;
`;

const StyledAlertSection = styled.div`
    margin-bottom: ${props => props.theme.spacing(3)}px;
`;

const StyledOtherActionsSection = styled.div`
    margin-top: ${props => props.theme.spacing(3)}px;
`;

export default PartyAuth;
