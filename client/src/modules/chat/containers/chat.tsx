import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
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
import { filter, findLast, forEach, groupBy } from 'lodash';
import { useUserProfileContext } from '../../user/contexts/profile';
import { UserRole } from '../../user/contexts/profile/types';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

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
    const chatListMessagesCountRef = useRef<number>();
    const oldestMessageIdRef = useRef<string>();
    const latestMessageIdRef = useRef<string>();
    const deleteMessageIdRef = useRef<string>();

    const cancelDeleteMessageHandler = () => {
        deleteMessageIdRef.current = undefined;
        setShowDeleteDialog(false);
    };

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
        (
            latestMessageId: string,
            messagesCount: number,
            listItems: ChatListItem[],
            oldestMessageId: string
        ) => {
            if (messagesCount < 1) {
                return;
            }
            listRef.current?.recomputeRowHeights();
            if (
                hasNewLatestMessage(latestMessageId) &&
                messagesCount > BATCH_SIZE
            ) {
                listRef.current.scrollToRow(listItems.length);
            } else if (messagesCount <= BATCH_SIZE) {
                const scrollHeight = listRef.current?.Grid.props.height;
                listRef?.current.scrollToPosition(scrollHeight);
            } else if (hasNewOldestMessage(oldestMessageId)) {
                const scrollRowIndex = listItems.findIndex(
                    i => i.data.id === oldestMessageId
                );
                listRef.current?.scrollToRow(scrollRowIndex);
            }
        },
        []
    );

    useEffect(
        function chatListItemsEffect() {
            const latestMessage = findLast(chatListItems, i => {
                return i.itemType === ChatListItemType.Message;
            }) as MessageItem;
            const latestMessageId = latestMessage?.data?.id;

            const chatListMessages = filter(
                chatListItems,
                i => i.itemType === ChatListItemType.Message
            ) as MessageItem[];

            const newChatMessagesCount =
                chatListMessages.length - chatListMessagesCountRef.current;

            let oldestMessageId: string;
            if (chatListMessages.length > BATCH_SIZE) {
                oldestMessageId =
                    chatListMessages[newChatMessagesCount]?.data?.id;
            }

            const messagesCount = chatListItems.filter(
                i => i.itemType === ChatListItemType.Message
            ).length;

            listRef.current?.recomputeRowHeights();

            if (!deleteMessageIdRef.current) {
                scrollChatList(
                    latestMessageId,
                    messagesCount,
                    chatListItems,
                    oldestMessageId
                );
            }

            chatListMessagesCountRef.current = chatListMessages.length;
            latestMessageIdRef.current = latestMessageId;
            oldestMessageIdRef.current = oldestMessageId;
        },
        [chatListItems, scrollChatList]
    );

    useEffect(
        function messagesEffect() {
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

    const handleChatSubmit: ChatFormSubmit = async ({ message }) => {
        addChatMessage(message);
    };

    return (
        <StyledContainer square component="section">
            <Dialog maxWidth="xs" open={showDeleteDialog}>
                <DialogTitle>Delete Message</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permantely delete this message?
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
                    isNextPageLoading={isLoading}
                    loadNextPage={loadNextChatPage}
                    virtualListProps={{ scrollToAlignment: 'start' }}
                    setListRef={el => {
                        listRef.current = el;
                    }}
                />
                {/* <StyledScrollBottomButtonContainer>
                    <StyledScrollBottomButton>
                        <ArrowDownwardIcon color="secondary" fontSize="large" />
                    </StyledScrollBottomButton>
                </StyledScrollBottomButtonContainer> */}
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
