import React from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { TextField } from 'formik-material-ui';
import { Button } from '@material-ui/core';

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

const initialValues: RegisterFormValues = { name: '', password: '' };

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
    const validationSchema: Yup.SchemaOf<RegisterFormValues> = Yup.object({
        name: Yup.string().required('Required'),
        password: Yup.string().required('Required')
    });

    const onSubmitHandler = async (
        values: RegisterFormValues,
        { setSubmitting }: FormikHelpers<RegisterFormValues>
    ) => {
        await onSubmit(values);
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmitHandler}
            validateOnBlur={false}
            validationSchema={validationSchema}
        >
            {({ isValid, dirty, isSubmitting }) => (
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
                    <StyledSubmitSection>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={!(isValid && dirty) || isSubmitting}
                        >
                            Create Account
                        </Button>
                    </StyledSubmitSection>
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
`;

const StyledSubmitSection = styled.div`
    margin-top: ${props => props.theme.spacing(2)}px;
    margin-bottom: ${props => props.theme.spacing()}px;
`;

RegisterForm.defaultProps = {
    submitDisabled: false
};

export default RegisterForm;
