import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import SpotifyAuth from '../../spotify/containers/auth';
import { useIdentityContext } from '../../shared/contexts/identity';
import Button from '../../shared/components/FormElements/Button';

interface CreatePartyFormValues {
    name: string;
}

export type CreatePartySubmit = (
    values: CreatePartyFormValues
) => void | Promise<void>;

interface CreatePartyFormProps {
    onSubmit: CreatePartySubmit;
    submitDisabled?: boolean;
}

const CreatePartyForm: React.FC<CreatePartyFormProps> = ({
    onSubmit,
    submitDisabled,
}) => {
    const { spotifyToken } = useIdentityContext();

    const validationSchema = Yup.object<CreatePartyFormValues>({
        name: Yup.string().required('Required'),
    });

    const canSubmit = useCallback(() => {
        if (!submitDisabled && !spotifyToken?.length) {
            return false;
        } else {
            return !submitDisabled;
        }
    }, [spotifyToken?.length, submitDisabled]);

    const [submitEnabled, setSubmitEnabled] = useState<boolean>(canSubmit());

    useEffect(() => {
        setSubmitEnabled(canSubmit());
    }, [canSubmit]);

    const initialValues: CreatePartyFormValues = { name: '' };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {() => (
                <StyledForm>
                    <StyledFormInputSection>
                        <Field
                            name="name"
                            type="text"
                            margin="normal"
                            label="Name"
                            autoFocus
                            component={TextField}
                        />
                        <SpotifyAuth />
                    </StyledFormInputSection>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={!submitEnabled}
                    >
                        Submit
                    </Button>
                </StyledForm>
            )}
        </Formik>
    );
};

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    align-items: stretch;
`;

const StyledFormInputSection = styled.div`
    display: flex;
    align-items: stretch;
    flex-direction: column;
    justify-content: center;
    padding: 8px;
`;

CreatePartyForm.defaultProps = {
    submitDisabled: false,
};

export default CreatePartyForm;
