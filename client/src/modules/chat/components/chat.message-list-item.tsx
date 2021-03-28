import React from 'react';
import styled from 'styled-components';
import { DeleteForever } from '@material-ui/icons';
import {
    IconButton,
    Typography,
    TypographyProps,
    Collapse
} from '@material-ui/core';
import format from 'date-fns/format';

export interface Message {
    id: string;
    message?: string;
}

export type OnDeleteMessage = (id: Message['id']) => void;

export interface ChatMessageProps {
    message: {
        id: string;
        content: string;
        sender: string;
        timestamp: Date;
    };
    allowDelete?: boolean;
    onDeleteMessage: OnDeleteMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    allowDelete,
    onDeleteMessage
}) => {
    const deleteMessageHandler = () => onDeleteMessage(message.id);

    const time = format(new Date(message.timestamp), 'H:mm');

    return (
        <StyledListItem>
            <div style={{ flex: 0, position: 'relative' }}>
                {allowDelete && (
                    <StyledDeleteMessage
                        size="small"
                        onClick={deleteMessageHandler}
                    >
                        <DeleteForever fontSize="small" />
                    </StyledDeleteMessage>
                )}
            </div>
            <StyledMessage>
                <StyledMessageTime component="span" variant="body2">
                    {time}
                </StyledMessageTime>
                <StyledMessageSender component="span" variant="body2">
                    {message.sender}
                </StyledMessageSender>
                <StyledMessageContent component="span" variant="body2">
                    {message.content}
                </StyledMessageContent>
            </StyledMessage>
        </StyledListItem>
    );
};

const StyledListItem = styled.li`
    background-color: #fff;
    display: flex;
    padding: ${props => props.theme.spacing(0.5)}px;
    border-radius: ${props => props.theme.shape.borderRadius}px;
    transition: ${props =>
        props.theme.transitions.create(['height'], {
            duration: 1000
        })};

    &:hover {
        background-color: ${({ theme }) => theme.palette.action.hover};
    }
`;

const StyledMessageTime: MessageTypography = styled(Typography)`
    white-space: nowrap;
    color: ${({ theme }) => theme.palette.grey[500]};
    margin-right: ${({ theme }) => theme.spacing(0.5)}px;
`;

const StyledMessage = styled.div`
    display: inline-block;
    flex: 1;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    transition: ${props =>
        props.theme.transitions.create(['height'], {
            duration: 1000
        })};

    ${StyledListItem}:hover & {
        padding-top: 3px;
    }
`;

type MessageTypography = React.ComponentType<
    TypographyProps<'span', { component?: 'span' }>
>;

const StyledMessageSender: MessageTypography = styled(Typography)`
    margin-right: ${({ theme }) => theme.spacing(0.5)}px;
    font-weight: ${({ theme }) => theme.typography.fontWeightBold};
`;

const StyledMessageContent: MessageTypography = styled(Typography)``;

const StyledDeleteMessage = styled(IconButton)`
    display: none;
    transition: ${props =>
        props.theme.transitions.create(['height'], {
            duration: 1000
        })};
    position: relative;

    ${StyledListItem}:hover & {
        display: inline-block;
        margin-right: ${({ theme }) => theme.spacing(0.5)}px;
        margin-left: ${({ theme }) => theme.spacing(0.5)}px;
    }
`;

ChatMessage.defaultProps = {
    allowDelete: false
};

export default ChatMessage;
