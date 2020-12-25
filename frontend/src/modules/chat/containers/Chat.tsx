import React, {
    Reducer,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState
} from 'react';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';

import ChatForm, { ChatFormSubmit } from '../components/ChatForm';
import ChatPost, { OnDeleteMessage, Message } from '../components/ChatMessage';
import { baseUrl } from '../../shared/config/api';
import { useUserProfileContext } from '../../user/contexts/profile';

export type ChatReducerState = Message[];

enum ChatReducerActionType {
    AddMessage,
    DeleteMessage
}

interface ChatReducerAction {
    type: ChatReducerActionType;
    payload: ChatReducerActionPayload;
}

export type ChatReducerActionPayload = Message;

interface ReceivedMessage {
    _id: string;
    message: string;
}

const chatReducer: Reducer<ChatReducerState, ChatReducerAction> = (
    state,
    action
) => {
    switch (action.type) {
        case ChatReducerActionType.AddMessage:
            return [...state, action.payload];
        case ChatReducerActionType.DeleteMessage:
            return [...state.filter(s => s.id !== action.payload.id)];
        default:
            return state;
    }
};

const Chat: React.FC = () => {
    const [messages, dispatch] = useReducer(chatReducer, []);
    const [socket, setSocket] = useState<Socket>(null);

    const { userProfile } = useUserProfileContext();

    useEffect(() => {
        if (!socket) {
            setSocket(io(baseUrl));
        }

        return () => socket && socket.disconnect();
    }, [socket]);

    useEffect(() => {
        if (!socket) {
            return;
        }

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

        socket.on('message', (data: ReceivedMessage) => {
            console.log(data);
            dispatch({
                type: ChatReducerActionType.AddMessage,
                payload: {
                    id: data._id,
                    message: data.message
                }
            });
        });
    }, [socket]);

    useEffect(() => {
        if (!socket || !userProfile.partyId) {
            return;
        }

        socket.emit('join', userProfile.partyId);
    }, [socket, userProfile?.partyId]);

    const submitHandler: ChatFormSubmit = async ({ message }) => {
        const messageData = {
            message,
            senderId: userProfile?.userId,
            partyId: userProfile?.partyId
        };
        socket.emit('message', messageData);
    };

    const deleteMessageHandler: OnDeleteMessage = useCallback(id => {
        dispatch({
            type: ChatReducerActionType.DeleteMessage,
            payload: { id }
        });
    }, []);

    const renderMessages = useMemo(() => {
        return messages.map(message => {
            console.log(message.id);
            return (
                <ChatPost
                    onDeleteMessage={deleteMessageHandler}
                    key={message.id}
                    message={message}
                />
            );
        });
    }, [deleteMessageHandler, messages]);

    return (
        <Container>
            <ChatWindow>{renderMessages}</ChatWindow>
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
