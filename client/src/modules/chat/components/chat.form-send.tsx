import React, { useRef } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form, FormikConfig } from 'formik';
import { IconButton } from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';
import { InputBase, InputBaseProps } from 'formik-material-ui';

export interface ChatFormValues {
    message: string;
}

export type ChatFormSubmit = (values: ChatFormValues) => void | Promise<void>;

export interface ChatFormProps {
    onSubmit: ChatFormSubmit;
}

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit }) => {
    const validationSchema: Yup.SchemaOf<ChatFormValues> = Yup.object({
        message: Yup.string().required('Required')
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
            validationSchema={validationSchema}
        >
            <StyledForm>
                <Field
                    name="message"
                    inputRef={inputRef}
                    component={ChatInput}
                />
                <ChatSendMessage type="submit">
                    <SendRounded />
                </ChatSendMessage>
            </StyledForm>
        </Formik>
    );
};

const StyledForm = styled(Form)`
    display: flex;
    flex: 1;
`;

const ChatInput = styled((props: InputBaseProps) => (
    <InputBase placeholder="Send a message..." {...props} autoComplete="off" />
))`
    flex: 1;
    border-radius: ${props => props.theme.spacing(2)}px;
    padding: ${props => props.theme.spacing()}px;
    background-color: ${props => props.theme.palette.grey[50]};
    margin-right: ${props => props.theme.spacing()}px;

    &:hover {
        background-color: ${props => props.theme.palette.action.hover};
    }

    &:focus {
        background-color: ${props => props.theme.palette.action.focus};
    }
`;

const ChatSendMessage = styled(IconButton)`
    flex: 0 0 30px;
`;

export default ChatForm;
