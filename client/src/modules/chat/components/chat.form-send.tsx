import React, { useRef } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form, FormikConfig } from 'formik';
import { IconButton, Tooltip, TextField } from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';
import { fieldToTextField, TextFieldProps } from 'formik-material-ui';

export interface ChatFormValues {
    message: string;
}

export type ChatFormSubmit = (values: ChatFormValues) => void | Promise<void>;

export interface ChatFormProps {
    onSubmit: ChatFormSubmit;
}

const MUITextField = (props: TextFieldProps) => {
    return (
        <TextField
            {...fieldToTextField(props)}
            placeholder="Leave a message..."
            autoComplete="off"
            color="primary"
            fullWidth
            size="small"
            variant="outlined"
        />
    );
};

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit }) => {
    const validationSchema: Yup.SchemaOf<ChatFormValues> = Yup.object({
        message: Yup.string().required('')
    });

    const inputRef = useRef<HTMLInputElement>();

    const initialValues: ChatFormValues = { message: '' };

    const handleSubmit: FormikConfig<ChatFormValues>['onSubmit'] = async (
        values,
        helpers
    ) => {
        try {
            await onSubmit(values);
            helpers.resetForm();
            inputRef.current?.focus();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnBlur={false}
            validationSchema={validationSchema}
        >
            {({ isValid, dirty, isSubmitting }) => (
                <StyledForm>
                    <Field
                        name="message"
                        inputRef={inputRef}
                        component={MUITextField}
                    />
                    <Tooltip title="Send">
                        <span>
                            <ChatSendMessage
                                disabled={!(isValid && dirty) || isSubmitting}
                                type="submit"
                            >
                                <SendRounded />
                            </ChatSendMessage>
                        </span>
                    </Tooltip>
                </StyledForm>
            )}
        </Formik>
    );
};

const StyledForm = styled(Form)`
    display: flex;
    flex: 1;
    align-items: center;
    gap: ${props => props.theme.spacing()}px;
`;

const ChatSendMessage = styled(IconButton)`
    flex: 0 0 30px;
`;

export default ChatForm;
