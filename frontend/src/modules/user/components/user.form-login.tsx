import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form, FieldProps } from 'formik';
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import {
    CheckboxWithLabelProps,
    fieldToCheckbox,
    fieldToTextField,
    TextFieldProps
} from 'formik-material-ui';

import Button from '../../shared/components/FormElements/Button';

export interface LoginFormValues {
    name: string;
    password: string;
    anonymous: boolean;
}

export type LoginSubmit = (values: LoginFormValues) => void | Promise<void>;

interface LoginFormProps {
    onSubmit: LoginSubmit;
    submitDisabled?: boolean;
}

const LoginTextField = (props: TextFieldProps) => {
    const {
        form: { values }
    }: FieldProps<TextFieldProps, LoginFormValues> = props;

    return (
        <TextField {...fieldToTextField(props)} disabled={values.anonymous} />
    );
};

const AnonymousCheckbox = (props: CheckboxWithLabelProps) => {
    const {
        form: { setFieldValue, setErrors, errors },
        field: { name }
    }: FieldProps<CheckboxWithLabelProps, LoginFormValues> = props;

    const onChange = useCallback(
        (_event, checked) => {
            setFieldValue(name, checked);

            if (checked) {
                setErrors({ ...errors, name: null, password: null });
            }
        },
        [errors, name, setErrors, setFieldValue]
    );

    return (
        <FormControlLabel
            control={
                <Checkbox {...fieldToCheckbox(props)} onChange={onChange} />
            }
            label="Anonymous"
        />
    );
};

const userValidationSchema = Yup.object<LoginFormValues>({
    name: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    anonymous: Yup.boolean().optional()
});

const anonValidationSchema = Yup.object<LoginFormValues>({
    name: Yup.string().optional(),
    password: Yup.string().optional(),
    anonymous: Yup.boolean().optional()
});

const getValidationSchema = () =>
    Yup.lazy((values: LoginFormValues) => {
        return values.anonymous ? anonValidationSchema : userValidationSchema;
    });

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, submitDisabled }) => {
    const initialValues: LoginFormValues = {
        name: '',
        password: '',
        anonymous: false
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnBlur={false}
            validationSchema={getValidationSchema}
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
                            component={LoginTextField}
                        />
                        <Field
                            name="password"
                            type="password"
                            margin="normal"
                            label="Password"
                            component={LoginTextField}
                        />
                        <Field
                            component={AnonymousCheckbox}
                            type="checkbox"
                            name="anonymous"
                        />
                    </StyledFormInputSection>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={submitDisabled}
                    >
                        Login
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

LoginForm.defaultProps = {
    submitDisabled: false
};

export default LoginForm;
