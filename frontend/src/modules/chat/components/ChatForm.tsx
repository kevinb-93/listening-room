import React from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';
import { IconButton } from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';

export interface ChatFormValues {
    message: string;
}

export type ChatFormSubmit = (values: ChatFormValues) => void | Promise<void>;

export interface ChatFormProps {
    onSubmit: ChatFormSubmit;
}

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit }) => {
    const validationSchema = Yup.object<ChatFormValues>({
        message: Yup.string().required('Required'),
    });

    const initialValues: ChatFormValues = { message: '' };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            <Form>
                <ChatMessageBox>
                    <Field
                        name="message"
                        type="text"
                        label="Message"
                        placeholder="Type a message..."
                        as={ChatInput}
                    />
                    <ChatSendMessage type="submit">
                        <SendRounded />
                    </ChatSendMessage>
                </ChatMessageBox>
            </Form>
        </Formik>
    );
};

const ChatInput = styled.input`
    background-color: lightcyan;
    flex: 1;
`;

const ChatMessageBox = styled.div`
    display: flex;
    background-color: lightcoral;
    flex: 0 0 50px;
`;

const ChatSendMessage = styled(IconButton)`
    flex: 0 0 30px;
`;

export default ChatForm;
