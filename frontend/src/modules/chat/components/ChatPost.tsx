import React from 'react';
import styled from 'styled-components';
import { DeleteForever } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

export type OnDeletePost = (message: string) => void;

export interface ChatPostProps {
    message: string;
    onDeletePost: OnDeletePost;
}

const ChatPost: React.FC<ChatPostProps> = ({ message, onDeletePost }) => {
    return (
        <ChatPostContainer>
            <ChatPostMessage>{message}</ChatPostMessage>
            <DeletePost onClick={() => onDeletePost(message)}>
                <DeleteForever />
            </DeletePost>
        </ChatPostContainer>
    );
};

const ChatPostContainer = styled.div`
    background-color: #fff;
    display: flex;
    margin: 8px;
    padding: 8px;
`;

const ChatPostMessage = styled.span`
    flex: 1 1 auto;
`;

const DeletePost = styled(IconButton)`
    flex: 0 0 30px;
`;

export default ChatPost;
