import { useEffect, useCallback, useReducer } from 'react';
import { useWebSocketContext } from '../../shared/contexts/websocket';
import { useApiRequest } from '../../shared/hooks/use-api-request';
import { useUserProfileContext } from '../../user/contexts/profile';

enum ChatReducerActionType {
    AddMessage,
    DeleteMessage,
    SetMessages
}

type ChatReducerState = MessageData[];
type ChatReducerActionPayload = MessageData | MessageData[] | DeleteMessageData;

interface ReducerAction<
    T extends ChatReducerActionType,
    P extends ChatReducerActionPayload
> {
    type: T;
    payload: P;
}

type ChatReducerAction =
    | ReducerAction<ChatReducerActionType.AddMessage, MessageData>
    | ReducerAction<ChatReducerActionType.DeleteMessage, DeleteMessageData>
    | ReducerAction<ChatReducerActionType.SetMessages, MessageData[]>;

export interface DeleteMessageData {
    messageId: string;
}

export interface MessageData {
    id: string;
    timestamp: Date;
    sender: {
        id: string;
        name: string;
    };
    content: string;
}

const chatReducer = (state: ChatReducerState, action: ChatReducerAction) => {
    switch (action.type) {
        case ChatReducerActionType.AddMessage:
            return [...state, action.payload];
        case ChatReducerActionType.DeleteMessage:
            return [...state.filter(s => s.id !== action.payload.messageId)];
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

        socket.on('add_message', (data: MessageData) => {
            console.log(data);
            dispatch({
                type: ChatReducerActionType.AddMessage,
                payload: data
            });
        });

        socket.on('delete_message', (data: DeleteMessageData) => {
            console.log(data);
            dispatch({
                type: ChatReducerActionType.DeleteMessage,
                payload: { messageId: data.messageId }
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
                dispatch({
                    type: ChatReducerActionType.SetMessages,
                    payload: data.messages
                });
            }
        } catch (e) {
            console.error(e);
        }
    }, [getMessagesRequest, user?.party]);

    useEffect(() => {
        getChatMessages();
    }, [getChatMessages]);

    const addChatMessage = async (message: string) => {
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
                    payload: data
                });
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const deleteChatMessage = useCallback(
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
                        payload: { messageId: data.messageId }
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
