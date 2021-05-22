import React, { useCallback } from 'react';
import styled from 'styled-components';
import { DeleteForever } from '@material-ui/icons';
import {
    IconButton,
    Tooltip,
    Typography,
    TypographyProps
} from '@material-ui/core';

export interface ChatMessage {
    id: string;
    content: string;
    sender: string;
    time: string;
}

export type OnDeleteMessage = (id: ChatMessage['id']) => void;

export interface ChatMessageProps {
    message: ChatMessage;
    allowDelete?: boolean;
    onDeleteMessage: OnDeleteMessage;
}

export type ChatMessageSimpleProps = Pick<ChatMessageProps, 'message'>;

export const ChatMessageSimple: React.FC<ChatMessageSimpleProps> = ({
    message
}) => {
    return (
        <StyledListItem>
            <StyledMessage>
                <StyledMessageTime component="span" variant="body2">
                    {message.time}
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

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    allowDelete,
    onDeleteMessage
}) => {
    const deleteMessageHandler = useCallback(
        () => onDeleteMessage(message.id),
        [message.id, onDeleteMessage]
    );

    return (
        <StyledListItem>
            {allowDelete && (
                <div>
                    <Tooltip title="Delete">
                        <StyledDeleteMessage
                            size="small"
                            onClick={deleteMessageHandler}
                        >
                            <DeleteForever fontSize="small" />
                        </StyledDeleteMessage>
                    </Tooltip>
                </div>
            )}
            <StyledMessage>
                <StyledMessageTime component="span" variant="caption">
                    {message.time}
                </StyledMessageTime>
                <StyledMessageSender
                    component="span"
                    variant="body2"
                    color="textPrimary"
                >
                    {message.sender}
                </StyledMessageSender>
                <StyledMessageContent
                    component="span"
                    variant="body2"
                    color="textPrimary"
                >
                    {message.content}
                </StyledMessageContent>
            </StyledMessage>
        </StyledListItem>
    );
};

const StyledListItem = styled.li`
    display: flex;
    padding: ${({ theme }) => theme.spacing(0.5)}px;
    border-radius: ${props => props.theme.shape.borderRadius}px;

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
    padding-top: 3px;
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
