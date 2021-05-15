import React, { useCallback } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form, FieldProps, FormikHelpers } from 'formik';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Button
} from '@material-ui/core';
import {
    CheckboxWithLabelProps,
    fieldToCheckbox,
    fieldToTextField,
    TextFieldProps
} from 'formik-material-ui';

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
                setErrors({ ...errors, name: '', password: '' });
            }
        },
        [errors, name, setErrors, setFieldValue]
    );

    return (
        <StyledFormControlLabel
            control={
                <Checkbox {...fieldToCheckbox(props)} onChange={onChange} />
            }
            label="Anonymous"
        />
    );
};

const userValidationSchema: Yup.SchemaOf<LoginFormValues> = Yup.object({
    name: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    anonymous: Yup.boolean().optional().default(false)
});

const anonValidationSchema: Yup.SchemaOf<LoginFormValues> = Yup.object({
    name: Yup.string().optional().default(''),
    password: Yup.string().optional().default(''),
    anonymous: Yup.boolean().optional().default(false)
});

const getValidationSchema = () =>
    Yup.lazy((values: LoginFormValues) => {
        return values.anonymous ? anonValidationSchema : userValidationSchema;
    });

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const initialValues: LoginFormValues = {
        name: '',
        password: '',
        anonymous: false
    };

    const onSubmitHandler = async (
        values: LoginFormValues,
        { setSubmitting }: FormikHelpers<LoginFormValues>
    ) => {
        await onSubmit(values);
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmitHandler}
            validateOnBlur={false}
            validationSchema={getValidationSchema}
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
                    <StyledSubmitSection>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={!(isValid && dirty) || isSubmitting}
                        >
                            Login
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

const StyledFormControlLabel = styled(FormControlLabel)`
    margin-top: ${props => props.theme.spacing(2)}px;
    margin-bottom: ${props => props.theme.spacing()}px;
`;

LoginForm.defaultProps = {
    submitDisabled: false
};

export default LoginForm;
