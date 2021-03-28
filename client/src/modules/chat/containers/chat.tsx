import { Paper, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import ChatForm, { ChatFormSubmit } from '../components/chat.form-send';
import ChatMessageList from '../components/chat.message-list';
import ChatPost from '../components/chat.message-list-item';
import useLiveChat from '../hooks/use-live-chat';

const Chat: React.FC = () => {
    const { chatMessages, addChatMessage, deleteChatMessage } = useLiveChat();

    // const renderMessages = useMemo(() => {
    //     return chatMessages.map(message => {
    //         return (
    //             <ChatPost
    //                 onDeleteMessage={deleteChatMessage}
    //                 key={message.id}
    //                 message={{
    //                     id: message.id,
    //                     content: message.content,
    //                     timestamp: message.timestamp,
    //                     sender: message.sender.name
    //                 }}
    //             />
    //         );
    //     });
    // }, [chatMessages, deleteChatMessage]);

    const chatMessageList = useMemo(
        () => (
            <ChatMessageList
                chatMessages={chatMessages}
                onDeleteMessage={deleteChatMessage}
            />
        ),
        [chatMessages, deleteChatMessage]
    );

    const handleChatSubmit: ChatFormSubmit = ({ message }) => {
        addChatMessage(message);
    };

    return (
        <StyledContainer square component="section">
            <StyledChatHeader>
                <Typography variant="h6">CHAT</Typography>
            </StyledChatHeader>
            {chatMessageList}
            <StyledChatBox>
                <ChatForm onSubmit={handleChatSubmit} />
            </StyledChatBox>
        </StyledContainer>
    );
};

const StyledContainer = styled(Paper)`
    display: flex;
    flex-direction: column;
    width: 350px;
    overflow: hidden;
    border: 1px solid ${props => props.theme.palette.grey[400]};
`;

const StyledChatHeader = styled.div`
    display: flex;
    flex: 0 0;
    justify-content: center;
    padding: ${props => props.theme.spacing()}px;
    border: 1px solid ${props => props.theme.palette.grey[400]};
    background-color: ${props => props.theme.palette.grey.A100};
`;

const StyledChatWindow = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow-y: auto;
    overflow-x: hidden;
`;

const StyledChatBox = styled.div`
    display: flex;
    border: 1px solid ${props => props.theme.palette.grey[400]};
    flex: 0 0;
    padding: ${props => props.theme.spacing()}px;
`;

export default Chat;
