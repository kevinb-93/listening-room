import React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import Button from '../../shared/components/FormElements/Button';

interface JoinPartyFormValues {
    name: string;
    code: string;
}

export type JoinPartySubmit = (
    values: JoinPartyFormValues
) => void | Promise<void>;

interface JoinPartyFormProps {
    onSubmit: JoinPartySubmit;
    submitDisabled?: boolean;
}

const JoinPartyForm: React.FC<JoinPartyFormProps> = ({
    onSubmit,
    submitDisabled,
}) => {
    const validationSchema = Yup.object<JoinPartyFormValues>({
        name: Yup.string().required('Required'),
        code: Yup.string().required('Required'),
    });

    const initialValues: JoinPartyFormValues = { name: '', code: '' };

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
                        <Field
                            name="code"
                            type="text"
                            margin="normal"
                            label="Party Code"
                            component={TextField}
                        />
                    </StyledFormInputSection>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={submitDisabled}
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

JoinPartyForm.defaultProps = {
    submitDisabled: false,
};

export default JoinPartyForm;
