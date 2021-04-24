import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Typography
} from '@material-ui/core';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import styled from 'styled-components';
import ChatForm, { ChatFormSubmit } from '../components/chat.form-send';
import InfiniteList, {
    ListItem
} from '../../shared/components/UIElements/infinite-loader.list-reversed';
import useLiveChat, { BATCH_SIZE, MessageData } from '../hooks/use-live-chat';
import ChatMessageListItem, {
    ChatMessage,
    OnDeleteMessage
} from '../components/chat.message-list-item';
import format from 'date-fns/format';
import { List } from 'react-virtualized';
import { filter, findLast, first, forEach, groupBy } from 'lodash';
import { useUserProfileContext } from '../../user/contexts/profile';
import { UserRole } from '../../user/contexts/profile/types';

interface DateHeaderItem {
    itemType: ChatListItemType.DateHeader;
    data: { date: string; id: string };
}

interface MessageItem {
    itemType: ChatListItemType.Message;
    data: MessageData;
}

enum ChatListItemType {
    DateHeader,
    Message
}

type ChatListItem = DateHeaderItem | MessageItem;

enum ScrollChatReason {
    firstLoad = 'firstLoad',
    loadMore = 'loadMore',
    messageReceived = 'messageReceived',
    messageDeleted = 'messagedDeleted',
    messageCreated = 'messageCreated',
    noScroll = 'noScroll'
}

const Chat: React.FC = () => {
    const {
        chatMessages,
        addChatMessage,
        deleteChatMessage,
        hasNextPage,
        isLoading,
        getChatMessages
    } = useLiveChat();

    const { user } = useUserProfileContext();
    const [chatListItems, setChatListItems] = useState<ChatListItem[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const listRef = useRef<List>();
    const messageCountRef = useRef<number>();
    const oldestMessageIdRef = useRef<string>();
    const fetchMessagesCounterRef = useRef<number>(0);
    const latestMessageIdRef = useRef<string>();
    const deleteMessageIdRef = useRef<string>();
    const isScrolledBottomRef = useRef<boolean>();

    const cancelDeleteMessageHandler = () => {
        deleteMessageIdRef.current = undefined;
        setShowDeleteDialog(false);
    };

    const isFirstLoad = () => fetchMessagesCounterRef.current < 1;
    const isLoadMore = useCallback((oldestMessageId: string) => {
        return !isFirstLoad() && hasNewOldestMessage(oldestMessageId);
    }, []);
    const hasDeletedMessage = (messageCount: number) =>
        messageCount < messageCountRef.current;

    const didUserCreateMessage = useCallback(
        (messageId: string) => {
            const chatListMessages = filter(
                chatListItems,
                i => i.itemType === ChatListItemType.Message
            ) as MessageItem[];
            const message = chatListMessages?.find(
                m => m.data.id === messageId
            );
            const wasCreatedByUser = message?.data?.sender?.id === user?._id;
            return wasCreatedByUser;
        },
        [chatListItems, user?._id]
    );

    const hasReceivedMessage = useCallback(
        (latestMessageId: string) =>
            hasNewLatestMessage(latestMessageId) &&
            !didUserCreateMessage(latestMessageId),
        [didUserCreateMessage]
    );

    const hasCreatedMessage = useCallback(
        (latestMessageId: string) =>
            hasNewLatestMessage(latestMessageId) &&
            didUserCreateMessage(latestMessageId),
        [didUserCreateMessage]
    );

    const getScrollChatReason = useCallback(
        (
            oldestMessageId: string,
            latestMessageId: string,
            messageCount: number
        ): ScrollChatReason => {
            if (isFirstLoad()) return ScrollChatReason.firstLoad;
            if (isLoadMore(oldestMessageId)) return ScrollChatReason.loadMore;
            if (hasReceivedMessage(latestMessageId))
                return ScrollChatReason.messageReceived;
            if (hasDeletedMessage(messageCount))
                return ScrollChatReason.messageDeleted;
            if (hasCreatedMessage(latestMessageId))
                return ScrollChatReason.messageCreated;

            return null;
        },
        [hasCreatedMessage, hasReceivedMessage, isLoadMore]
    );

    const deleteMessageHandler = useCallback<OnDeleteMessage>(
        id => {
            const message = chatMessages.find(m => m.id === id);
            deleteMessageIdRef.current = message.id;
            setShowDeleteDialog(true);
        },
        [chatMessages]
    );

    const confirmDeleteMessageHandler = useCallback(async () => {
        try {
            await deleteChatMessage(deleteMessageIdRef.current);
        } catch (e) {
            console.error(e);
        } finally {
            deleteMessageIdRef.current = undefined;
            setShowDeleteDialog(false);
        }
    }, [deleteChatMessage]);

    const canDeleteMessage = useCallback(
        (senderId: ChatMessage['sender']) => {
            if (user.role === UserRole.Admin) return true;
            if (senderId === user._id) return true;
            return false;
        },
        [user._id, user.role]
    );

    const chatMessageList = useMemo<ListItem[]>(
        () =>
            chatListItems.map(item => {
                if (item.itemType == ChatListItemType.DateHeader) {
                    return {
                        id: item.data.date,
                        component: (
                            <StyledDateHeaderItemContainer>
                                <Typography variant="subtitle2">
                                    {item.data.date}
                                </Typography>
                            </StyledDateHeaderItemContainer>
                        )
                    };
                }

                const messageItem = item.data;
                const allowDelete = canDeleteMessage(messageItem.sender.id);

                const time = format(new Date(messageItem.timestamp), 'H:mm');
                const message: ChatMessage = {
                    ...messageItem,
                    sender: messageItem.sender.name,
                    time
                };
                return {
                    component: (
                        <ChatMessageListItem
                            message={message}
                            onDeleteMessage={deleteMessageHandler}
                            allowDelete={allowDelete}
                        />
                    ),
                    id: message.id
                };
            }),
        [canDeleteMessage, chatListItems, deleteMessageHandler]
    );

    const hasNewLatestMessage = (latestMessageId: string) => {
        return latestMessageId !== latestMessageIdRef.current;
    };

    const hasNewOldestMessage = (oldestMessageId: string) => {
        return oldestMessageId !== oldestMessageIdRef.current;
    };

    const scrollChatList = useCallback(
        (scrollReason: ScrollChatReason, oldestMessageId: string) => {
            console.log(scrollReason);
            switch (scrollReason) {
                case ScrollChatReason.firstLoad: {
                    const scrollHeight = listRef.current?.Grid.props.height;
                    return listRef.current?.scrollToPosition(scrollHeight);
                }
                case ScrollChatReason.loadMore: {
                    const scrollRowIndex = chatListItems.findIndex(
                        m => m.data.id === oldestMessageId
                    );
                    return listRef.current.scrollToRow(scrollRowIndex);
                }
                case ScrollChatReason.messageReceived: {
                    if (!isScrolledBottomRef.current) return;
                    return listRef.current?.scrollToRow(chatListItems.length);
                }
                case ScrollChatReason.messageCreated: {
                    return listRef.current?.scrollToRow(chatListItems.length);
                }
                default:
                    return null;
            }
        },
        [chatListItems]
    );

    useEffect(
        function chatListItemsEffect() {
            const chatListMessages = filter(
                chatListItems,
                i => i.itemType === ChatListItemType.Message
            ) as MessageItem[];
            const latestMessage = findLast(chatListMessages);
            const oldestMessage = first(chatListMessages);

            const scrollChatReason = getScrollChatReason(
                oldestMessage?.data?.id,
                latestMessage?.data?.id,
                chatListMessages.length
            );

            scrollChatList(scrollChatReason, oldestMessageIdRef.current);

            latestMessageIdRef.current = latestMessage?.data?.id;
            oldestMessageIdRef.current = oldestMessage?.data?.id;
            messageCountRef.current = chatListMessages.length;
        },
        [chatListItems, getScrollChatReason, scrollChatList]
    );

    useEffect(
        function messagesEffect() {
            let fetchCount = chatMessages.length / BATCH_SIZE;
            if (fetchCount > 0) fetchCount += 1;
            fetchMessagesCounterRef.current = fetchCount;

            const groupedDates = groupBy(chatMessages, m =>
                format(new Date(m.timestamp), 'dd/MM/yyyy')
            );

            let chatListItems: ChatListItem[] = [];

            forEach(groupedDates, (values, key) => {
                const dateHeaderItem: DateHeaderItem = {
                    itemType: ChatListItemType.DateHeader,
                    data: { date: key, id: key }
                };

                const messageItems: MessageItem[] = values.map(m => {
                    return { itemType: ChatListItemType.Message, data: m };
                });

                chatListItems = [
                    ...chatListItems,
                    dateHeaderItem,
                    ...messageItems
                ];
            });

            setChatListItems(chatListItems);
        },
        [chatMessages]
    );

    const loadNextChatPage = useCallback(
        () => getChatMessages(chatMessages[0]?.timestamp),
        [chatMessages, getChatMessages]
    );

    const handleChatSubmit: ChatFormSubmit = useCallback(
        async ({ message }) => {
            addChatMessage(message);
        },
        [addChatMessage]
    );

    const onListScroll = (isScrolledBottom: boolean) => {
        isScrolledBottomRef.current = isScrolledBottom;
    };

    return (
        <StyledContainer square component="section">
            <Dialog maxWidth="xs" open={showDeleteDialog}>
                <DialogTitle>Delete Message</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanately delete this
                        message?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={cancelDeleteMessageHandler}>
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteMessageHandler}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <StyledChatHeader>
                <Typography variant="h6">CHAT</Typography>
            </StyledChatHeader>
            <StyledInfiniteListContainer>
                <InfiniteList
                    list={chatMessageList}
                    batchSize={BATCH_SIZE}
                    hasNextPage={hasNextPage}
                    onListScroll={onListScroll}
                    isNextPageLoading={isLoading}
                    loadNextPage={loadNextChatPage}
                    virtualListProps={{ scrollToAlignment: 'start' }}
                    setListRef={el => {
                        listRef.current = el;
                    }}
                />
            </StyledInfiniteListContainer>
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

const StyledDateHeaderItemContainer = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const StyledChatHeader = styled.div`
    display: flex;
    flex: 0 0;
    justify-content: center;
    padding: ${props => props.theme.spacing()}px;
    border: 1px solid ${props => props.theme.palette.grey[400]};
    background-color: ${props => props.theme.palette.grey.A100};
`;

const StyledInfiniteListContainer = styled.div`
    flex: 1;
`;

const StyledChatBox = styled.div`
    display: flex;
    border: 1px solid ${props => props.theme.palette.grey[400]};
    flex: 0 0;
    padding: ${props => props.theme.spacing()}px;
`;

export default Chat;
