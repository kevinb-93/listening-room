import React from 'react';
import styled from 'styled-components';
import { DeleteForever } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

export interface Message {
    id: string;
    message?: string;
}

export type OnDeleteMessage = (id: Message['id']) => void;

export interface ChatMessageProps {
    message: Message;
    onDeleteMessage: OnDeleteMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    onDeleteMessage
}) => {
    return (
        <ChatMessageContainer>
            <StyledMessage>{message.message}</StyledMessage>
            <DeleteMessage onClick={() => onDeleteMessage(message.id)}>
                <DeleteForever />
            </DeleteMessage>
        </ChatMessageContainer>
    );
};

const ChatMessageContainer = styled.div`
    background-color: #fff;
    display: flex;
    margin: 8px;
    padding: 8px;
`;

const StyledMessage = styled.span`
    flex: 1 1 auto;
`;

const DeleteMessage = styled(IconButton)`
    flex: 0 0 30px;
`;

export default ChatMessage;
