import React from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import Button from '../../shared/components/FormElements/Button';

interface CreatePartyFormValues {
    name: string;
    password: string;
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
    submitDisabled
}) => {
    const validationSchema = Yup.object<CreatePartyFormValues>({
        name: Yup.string().required('Required'),
        password: Yup.string().required('Required')
    });

    const initialValues: CreatePartyFormValues = { name: '', password: '' };

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
                            label="Your Name"
                            autoFocus
                            component={TextField}
                        />
                        <Field
                            name="password"
                            type="password"
                            margin="normal"
                            label="Your Password"
                            component={TextField}
                        />
                    </StyledFormInputSection>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={submitDisabled}
                    >
                        Create
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
    submitDisabled: false
};

export default CreatePartyForm;
