import React, { useEffect } from 'react';
import { Container, Link } from '@material-ui/core';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

import { useApiRequest } from '../../shared/hooks/use-api-request';
import { useUserIdentityContext } from '../../user/contexts/identity';
import LoginForm, {
    LoginFormValues,
    LoginSubmit
} from '../../user/components/user.form-login';
import { AxiosResponse } from 'axios';
import { IdentityReducerActionType } from '../../user/contexts/identity/reducer/types';
import FormCard from '../../shared/components/FormElements/Card';

const PartyAuth: React.FC = () => {
    const { dispatch } = useUserIdentityContext();

    const {
        sendRequest: sendLoginRequest,
        error: loginError
    } = useApiRequest();

    useEffect(() => {
        document.title = 'Get the party started!';
    }, []);

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

    const extraFormContent = (
        <Link component={RouterLink} to="/register">
            Create new account
        </Link>
    );

    return (
        <StyledSection>
            <StyledAuthContainer>
                <FormCard
                    title="Login"
                    form={<LoginForm onSubmit={loginHandler} />}
                    errorMessage={loginError}
                    extraContent={extraFormContent}
                />
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

export default PartyAuth;
