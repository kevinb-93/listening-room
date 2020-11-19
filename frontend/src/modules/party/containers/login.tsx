import React, { useCallback, useEffect, useState } from 'react';
import { Typography, Snackbar, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Alert } from '@material-ui/lab';
import styled from 'styled-components';

import { useApiRequest } from '../../shared/hooks/api-hook';
import { useIdentityContext } from '../../shared/contexts/identity';
import CreatePartyForm, {
    CreatePartySubmit
} from '../components/CreatePartyForm';
import JoinPartyForm, { JoinPartySubmit } from '../components/JoinPartyForm';
import TabbedForm, {
    TabbedForms
} from '../../shared/components/FormElements/TabbedForm';

const TransitionUp = (props: TransitionProps) => (
    <Slide {...props} direction="up" />
);

const Login: React.FC = () => {
    const { login } = useIdentityContext();

    const { sendRequest, error, clearError } = useApiRequest();

    useEffect(() => {
        document.title = 'Get the party started!';
    }, []);

    const createPartySubmitHandler: CreatePartySubmit = async ({ name }) => {
        try {
            const response = await sendRequest(`party/create`, {
                data: {
                    name
                },
                method: 'POST'
            });
            login(response.data.token, null);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };

    const joinPartySubmitHandler: JoinPartySubmit = async ({ name, code }) => {
        try {
            const response = await sendRequest(`party/join/${code}`, {
                data: {
                    name
                },
                method: 'POST'
            });
            login(response.data.token, null);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };

    const tabbedForms: TabbedForms = [
        {
            tabText: 'Join',
            form: <JoinPartyForm onSubmit={joinPartySubmitHandler} />
        },
        {
            tabText: 'Create',
            form: <CreatePartyForm onSubmit={createPartySubmitHandler} />
        }
    ];

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
        <Container>
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
            <Typography variant={'h4'}>Get the party started!</Typography>
            <TabbedForm tabbedForms={tabbedForms} />
        </Container>
    );
};

const Container = styled.section`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
`;

export default Login;
