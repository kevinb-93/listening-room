import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';

import ChatForm, { ChatFormSubmit } from '../components/ChatForm';
import ChatPost, { OnDeletePost } from '../components/ChatPost';
import { useApiRequest } from '../../shared/hooks/api-hook';
import { useUserIdentityContext } from '../../shared/contexts/identity';
import { usePartyContext } from '../../party/context';
import { baseUrl } from '../../shared/config/api';

interface Message {
    id: string;
    message: string;
}

const Chat: React.FC = () => {
    const [posts, setPosts] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket>(null);

    const { userToken } = useUserIdentityContext();
    const { activeParty } = usePartyContext();
    const { sendRequest } = useApiRequest();

    const deletePostHandler: OnDeletePost = useCallback(
        (message: Message['message']) => {
            setPosts(posts.filter(p => p.message !== message));
        },
        [posts]
    );

    useEffect(() => {
        const socket = io(baseUrl);

        socket.on('connect', () => {
            console.log('socket connected');
        });

        socket.on('disconnect', (reason: string) => {
            console.log('socket disconnected: ' + reason);
            if (reason === 'io server disconnect') {
                socket.connect();
            }
        });

        socket.on('connect_error', (e: unknown) => {
            console.error(e);
        });

        socket.on('messages', (data: unknown) => {
            console.log(data);
            // switch (data.action) {
            //     case 'create':
            //         setPosts([
            //             ...posts,
            //             { id: data.id, message: data.message }
            //         ]);
            //         break;
            //     case 'delete':
            //         deletePostHandler(data.messageId);
            //         break;
            // }
        });

        return () => socket.disconnect();
    }, []);

    const submitHandler: ChatFormSubmit = async ({ message }) => {
        const response = await sendRequest(`${baseUrl}/api/message/create`, {
            method: 'POST',
            data: { message, partyId: activeParty }
        });

        if (response.status === 201) {
            setPosts([
                ...posts,
                {
                    id: (posts.length + 1).toString(),
                    message
                }
            ]);
        }
    };

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
