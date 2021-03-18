import { useEffect, useCallback, useReducer } from 'react';
import { useWebSocketContext } from '../../shared/contexts/websocket';
import { useApiRequest } from '../../shared/hooks/use-api-request';
import { useUserProfileContext } from '../../user/contexts/profile';
import { ChatFormSubmit } from '../components/chat.form-send';
import { Message, OnDeleteMessage } from '../components/chat.message';

enum ChatReducerActionType {
    AddMessage,
    DeleteMessage,
    SetMessages
}

type ChatReducerState = Message[];
type ChatReducerActionPayload = Message | Message[];

interface ReducerAction<
    T extends ChatReducerActionType,
    P extends ChatReducerActionPayload
> {
    type: T;
    payload: P;
}

type ChatReducerAction =
    | ReducerAction<ChatReducerActionType.AddMessage, Message>
    | ReducerAction<ChatReducerActionType.DeleteMessage, Message>
    | ReducerAction<ChatReducerActionType.SetMessages, Message[]>;

export interface AddMessageData {
    _id: string;
    message: string;
}

export interface DeleteMessageData {
    messageId: string;
}

export interface GetMessagesData {
    _id: string;
    message: string;
}

const chatReducer = (state: ChatReducerState, action: ChatReducerAction) => {
    switch (action.type) {
        case ChatReducerActionType.AddMessage:
            return [...state, action.payload];
        case ChatReducerActionType.DeleteMessage:
            return [...state.filter(s => s.id !== action.payload.id)];
        case ChatReducerActionType.SetMessages:
            return action.payload;
        default:
            return state;
    }
};

const useLiveChat = () => {
    const [chatMessages, dispatch] = useReducer(chatReducer, []);
    const { socket } = useWebSocketContext();
    const { user } = useUserProfileContext();

    const { sendRequest: sendAddMessageRequest } = useApiRequest();
    const { sendRequest: sendDeleteMessageRequest } = useApiRequest();
    const { sendRequest: getMessagesRequest } = useApiRequest();

    const initChatEvents = useCallback(() => {
        if (!socket) {
            return;
        }

        socket.on('add_message', (data: AddMessageData) => {
            console.log(data);
            dispatch({
                type: ChatReducerActionType.AddMessage,
                payload: {
                    id: data._id,
                    message: data.message
                }
            });
        });

        socket.on('delete_message', (data: DeleteMessageData) => {
            console.log(data);
            dispatch({
                type: ChatReducerActionType.DeleteMessage,
                payload: {
                    id: data.messageId
                }
            });
        });
    }, [socket]);

    useEffect(() => {
        initChatEvents();
    }, [initChatEvents]);

    const getChatMessages = useCallback(async () => {
        if (!user.party) return;

        try {
            const { status, data } = await getMessagesRequest(
                `party/${user.party}/messages`,
                {}
            );

            if (status === 200) {
                const messages: Message[] = data.messages.map(
                    (m: GetMessagesData) => {
                        return { id: m._id, message: m.message };
                    }
                );
                dispatch({
                    type: ChatReducerActionType.SetMessages,
                    payload: messages
                });
            }
        } catch (e) {
            console.error(e);
        }
    }, [getMessagesRequest, user?.party]);

    useEffect(() => {
        getChatMessages();
    }, [getChatMessages]);

    const addChatMessage: ChatFormSubmit = async ({ message }) => {
        if (!user.party) return;

        try {
            const requestData = {
                message,
                partyId: user.party
            };
            const { status, data } = await sendAddMessageRequest(
                '/chat/create',
                {
                    data: requestData,
                    method: 'POST'
                }
            );

            if (status === 201) {
                socket.emit('add_message', data);
                dispatch({
                    type: ChatReducerActionType.AddMessage,
                    payload: {
                        id: data._id,
                        message: data.message
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteChatMessage: OnDeleteMessage = useCallback(
        async id => {
            try {
                const { status, data } = await sendDeleteMessageRequest(
                    `/chat/delete/${id}`,
                    {
                        method: 'DELETE'
                    }
                );

                if (status === 200) {
                    socket.emit('delete_message', data);
                    dispatch({
                        type: ChatReducerActionType.DeleteMessage,
                        payload: { id: data.messageId }
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
        [sendDeleteMessageRequest, socket]
    );

    return { chatMessages, addChatMessage, deleteChatMessage };
};

export default useLiveChat;
