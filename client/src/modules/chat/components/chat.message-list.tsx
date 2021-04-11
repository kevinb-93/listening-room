import { List, Typography } from '@material-ui/core';
import React, { Fragment, useEffect, useRef } from 'react';
import styled from 'styled-components';
import uniqBy from 'lodash/uniqBy';
import startOfDay from 'date-fns/startOfDay';
import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import max from 'date-fns/max';
import { MessageData } from '../hooks/use-live-chat';
import ChatMessageListItem, { OnDeleteMessage } from './chat.message-list-item';

interface ChatMessageListProps {
    chatMessages: MessageData[];
    onDeleteMessage: OnDeleteMessage;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
    chatMessages,
    onDeleteMessage
}) => {
    const scrollBottomRef = useRef<HTMLDivElement>();
    const latestMessageTimeRef = useRef<number>();

    const renderMessages = (messages: MessageData[]) =>
        messages.map(message => (
            <ChatMessageListItem
                onDeleteMessage={onDeleteMessage}
                key={message.id}
                message={{
                    id: message.id,
                    content: message.content,
                    time: message.timestamp.toISOString(),
                    sender: message.sender.name
                }}
                allowDelete
            />
        ));

    useEffect(
        function scrollToBottom() {
            const latestMessageTime = getLatestMessageTime(chatMessages);
            if (latestMessageTime === latestMessageTimeRef.current) return;
            scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            latestMessageTimeRef.current = latestMessageTime;
        },
        [chatMessages]
    );

    const renderMessagesAtDate = (date: Date) => (
        <Fragment key={date.getTime()}>
            <StyledDateItem>
                <StyledDateText variant={'body2'}>
                    {getDateText(date)}
                </StyledDateText>
            </StyledDateItem>
            {renderMessages(getMessagesAtDate(chatMessages, date))}
            <div ref={scrollBottomRef} />
        </Fragment>
    );

    const renderMessagesByDate = (dates: Date[]) => {
        return dates.map(d => renderMessagesAtDate(d));
    };

    return (
        <StyledList>
            {renderMessagesByDate(getMessageDates(chatMessages))}
        </StyledList>
    );
};

const getLatestMessageTime = (messages: MessageData[]) => {
    if (!messages?.length) return null;
    const latestDate = max(messages.map(m => new Date(m.timestamp)));
    const time = latestDate.getTime();
    return time;
};

const getMessageDates = (messages: MessageData[]) => {
    const dates = messages.map(message =>
        startOfDay(new Date(message.timestamp))
    );
    const uniqueDates = uniqBy(dates, date => date.getTime());

    return uniqueDates;
};

const getMessagesAtDate = (messages: MessageData[], date: Date) => {
    return messages.filter(m =>
        isSameDay(new Date(m.timestamp), new Date(date))
    );
};

const getDateText = (date: Date) => {
    if (!isValid(date)) return '';
    if (isToday(date)) return 'TODAY';
    if (isYesterday(date)) return 'YESTERDAY';
    return format(date, 'd/M/y');
};

const StyledDateText = styled(Typography)`
    color: ${({ theme }) => theme.palette.grey[500]};
`;

const StyledDateItem = styled.li`
    display: flex;
    justify-content: center;
`;

const StyledList = styled(List)`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;

    & > :first-child {
        margin-top: auto;
    }
`;

export default ChatMessageList;
