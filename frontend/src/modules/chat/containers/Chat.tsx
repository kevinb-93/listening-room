import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';

import ChatForm, { ChatFormSubmit } from '../components/ChatForm';
import ChatPost, { OnDeletePost } from '../components/ChatPost';
import { baseUrl } from '../../shared/config/server';

interface Message {
    id: string;
    message: string;
}

const Chat: React.FC = () => {
    useEffect(() => {
        const socket = io(baseUrl);
    }, []);

    const submitHandler: ChatFormSubmit = ({ message }) => {
        console.log('form submitted');
        setPosts([
            ...posts,
            {
                id: (posts.length + 1).toString(),
                message
            }
        ]);
    };

    const deletePostHandler: OnDeletePost = (message: Message['message']) => {
        setPosts(posts.filter(p => p.message !== message));
    };

    const [posts, setPosts] = useState<Message[]>([]);

    return (
        <Container>
            <ChatWindow>
                {posts.map(p => {
                    return (
                        <ChatPost
                            onDeletePost={deletePostHandler}
                            key={p.id}
                            message={p.message}
                        />
                    );
                })}
            </ChatWindow>
            <ChatForm onSubmit={submitHandler} />
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

const ChatInput = styled.input`
    background-color: green;
    flex: 1;
`;

const ChatMessageBox = styled.div`
    display: flex;
    background-color: blue;
    flex: 0 0 50px;
`;

const ChatSendMessage = styled.button`
    flex: 0 0 30px;
`;

export default Chat;
