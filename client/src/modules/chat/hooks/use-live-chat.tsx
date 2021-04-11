import { useEffect, useCallback, useReducer, useState } from 'react';
import sortBy from 'lodash/sortBy';
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
            return [...action.payload, ...state];
        default:
            return state;
    }
};

export const BATCH_SIZE = 50;

const useLiveChat = () => {
    const [chatMessages, dispatch] = useReducer(chatReducer, []);
    const { socket } = useWebSocketContext();
    const { user } = useUserProfileContext();
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        sendRequest: sendAddMessageRequest,
        isLoading: isAddMessageLoading
    } = useApiRequest();
    const {
        sendRequest: sendDeleteMessageRequest,
        isLoading: isDeleteMessageLoading
    } = useApiRequest();
    const {
        sendRequest: getMessagesRequest,
        isLoading: isGetMessagesLoading
    } = useApiRequest();

    useEffect(
        function isLoadingEffect() {
            if (isGetMessagesLoading) {
                setIsLoading(true);
            } else {
                setIsLoading(false);
            }
        },
        [isAddMessageLoading, isDeleteMessageLoading, isGetMessagesLoading]
    );

    // useEffect(
    //     function hasNextPageEffect() {
    //         if (chatMessages.length && chatMessages.length % PAGE_LIMIT === 0) {
    //             setHasNextPage(true);
    //         } else {
    //             setHasNextPage(false);
    //         }
    //     },
    //     [chatMessages.length]
    // );

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

    const getChatMessages = useCallback(
        async (createdBefore: Date = new Date()) => {
            if (!user.party) return;

            try {
                const { status, data } = await getMessagesRequest(
                    `party/${user.party}/messages`,
                    {
                        params: { createdBefore }
                    }
                );

                const messages = sortBy(data.messages, 'timestamp');

                if (status === 200) {
                    dispatch({
                        type: ChatReducerActionType.SetMessages,
                        payload: messages
                    });
                    setHasNextPage(data.hasNextPage);
                }
            } catch (e) {
                console.error(e);
            }
        },
        [getMessagesRequest, user?.party]
    );

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

    return {
        chatMessages,
        addChatMessage,
        deleteChatMessage,
        getChatMessages,
        hasNextPage,
        isLoading
    };
};

export default useLiveChat;
