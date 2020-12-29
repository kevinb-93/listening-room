import React, { useMemo } from 'react';
import styled from 'styled-components';

import ChatForm from '../components/ChatForm';
import ChatPost from '../components/ChatMessage';
import useLiveChat from '../hooks/useLiveChat';

const Chat: React.FC = () => {
    const { chatMessages, addChatMessage, deleteChatMessage } = useLiveChat();

    const renderMessages = useMemo(() => {
        return chatMessages.map(message => {
            return (
                <ChatPost
                    onDeleteMessage={deleteChatMessage}
                    key={message.id}
                    message={message}
                />
            );
        });
    }, [chatMessages, deleteChatMessage]);

    return (
        <Container>
            <ChatWindow>{renderMessages}</ChatWindow>
            <ChatForm onSubmit={addChatMessage} />
        </Container>
    );
};

const Container = styled.section`
    background-color: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const ChatWindow = styled.div`
    background-color: red;
    flex: 1 auto;
`;

export default Chat;
