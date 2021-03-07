import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, Snackbar, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Alert } from '@material-ui/lab';
import styled from 'styled-components';

import { useApiRequest } from '../../shared/hooks/use-api-request';
import CreatePartyForm, {
    CreatePartySubmit
} from '../../party/components/party.form-create';
import JoinPartyForm, {
    JoinPartySubmit
} from '../../party/components/party.form-join';
import TabbedForm, {
    TabbedForms
} from '../../shared/components/FormElements/TabbedForm';

const TransitionUp = (props: TransitionProps) => (
    <Slide {...props} direction="up" />
);

const Auth: React.FC = () => {
    const {
        sendRequest: joinPartyRequest,
        error: joinPartyError,
        clearError: clearJoinPartyError
    } = useApiRequest();
    const {
        sendRequest: createpartyRequest,
        error: createPartyError,
        clearError: clearCreatePartyError
    } = useApiRequest();

    useEffect(() => {
        document.title = 'Get the party started!';
    }, []);

    const joinPartyHandler: JoinPartySubmit = useCallback(
        async data => {
            try {
                const res = await joinPartyRequest(`party/join`, {
                    method: 'POST',
                    data
                });
            } catch (e) {
                console.error(e);
            }
        },
        [joinPartyRequest]
    );
    const createPartyHandler: CreatePartySubmit = useCallback(
        async data => {
            try {
                const res = await createpartyRequest(`party/create`, {
                    method: 'POST',
                    data
                });
            } catch (e) {
                console.error(e);
            }
        },
        [createpartyRequest]
    );

    const tabbedForms: TabbedForms = useMemo(
        () => [
            {
                tabText: 'Join Party',
                form: <JoinPartyForm onSubmit={joinPartyHandler} />
            },
            {
                tabText: 'Create Party',
                form: <CreatePartyForm onSubmit={createPartyHandler} />
            }
        ],
        [createPartyHandler, joinPartyHandler]
    );

    const [alertError, setAlertError] = useState('');

    const clearErrors = useCallback(() => {
        setAlertError('');
        clearCreatePartyError();
        clearJoinPartyError();
    }, [clearCreatePartyError, clearJoinPartyError]);

    useEffect(
        function checkSetAlertError() {
            if (joinPartyError) {
                return setAlertError(joinPartyError);
            } else if (createPartyError) {
                return setAlertError(createPartyError);
            } else {
                clearErrors();
            }
        },
        [clearErrors, createPartyError, joinPartyError]
    );

    return (
        <StyledContainer>
            <Snackbar
                TransitionComponent={TransitionUp}
                open={Boolean(alertError)}
                onClose={clearErrors}
                onExited={clearErrors}
                autoHideDuration={6000}
            >
                {Boolean(alertError) && (
                    <Alert
                        variant="filled"
                        severity="error"
                        onClose={clearErrors}
                    >
                        {alertError}
                    </Alert>
                )}
            </Snackbar>
            <Typography variant={'h4'}>Get the party started!</Typography>
            <TabbedForm tabbedForms={tabbedForms} />
        </StyledContainer>
    );
};

const StyledContainer = styled.section`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
`;

export default Auth;
