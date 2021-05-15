import { Container, Link } from '@material-ui/core';
import { useApiRequest } from '../../../modules/shared/hooks/use-api-request';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import RegisterForm, { RegisterSubmit } from '../components/user.form-register';
import { useUserIdentityContext } from '../contexts/identity';
import { IdentityReducerActionType } from '../contexts/identity/reducer/types';
import FormCard from '../../shared/components/FormElements/Card';

const UserRegister: React.FC = () => {
    const { error: registerError, sendRequest } = useApiRequest();
    const { dispatch } = useUserIdentityContext();

    const registerHandler: RegisterSubmit = async data => {
        try {
            const response = await sendRequest(`user/register`, {
                method: 'POST',
                data: {
                    name: data.name,
                    password: data.password,
                    isAnonymous: false
                }
            });

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
        <Link component={RouterLink} to="/login">
            Login
        </Link>
    );

    return (
        <StyledSection>
            <StyledAuthContainer>
                <FormCard
                    title="Create new account"
                    form={<RegisterForm onSubmit={registerHandler} />}
                    errorMessage={registerError}
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

export default UserRegister;
