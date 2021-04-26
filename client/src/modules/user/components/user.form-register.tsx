import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import Button from '../../shared/components/FormElements/Button';

interface RegisterFormValues {
    name: string;
    password: string;
}

export type RegisterSubmit = (
    values: RegisterFormValues
) => void | Promise<void>;

interface RegisterFormProps {
    onSubmit: RegisterSubmit;
    submitDisabled?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    submitDisabled
}) => {
    const validationSchema: Yup.SchemaOf<RegisterFormValues> = Yup.object({
        name: Yup.string().required('Required'),
        password: Yup.string().required('Required')
    });

    const canSubmit = useCallback(() => {
        if (!submitDisabled) {
            return false;
        } else {
            return !submitDisabled;
        }
    }, [submitDisabled]);

    const [submitEnabled, setSubmitEnabled] = useState<boolean>(canSubmit());

    useEffect(() => {
        setSubmitEnabled(canSubmit());
    }, [canSubmit]);

    const initialValues: RegisterFormValues = { name: '', password: '' };

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
                            label="Password"
                            component={TextField}
                        />
                    </StyledFormInputSection>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={!submitEnabled}
                    >
                        Register
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

RegisterForm.defaultProps = {
    submitDisabled: false
};

export default RegisterForm;
