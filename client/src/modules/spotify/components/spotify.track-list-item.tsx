import React from 'react';
import styled from 'styled-components';
import { IconButton, ListItem, Tooltip, Typography } from '@material-ui/core';
import QueueMusicIcon from '@material-ui/icons/Queue';
import RemoveIcon from '@material-ui/icons/Remove';

interface TrackItemImage {
    size: number;
    src: string;
}

export interface TrackProps {
    id: string;
    songTitle: string;
    artist: string;
    duration: string;
}

export interface TrackItemProps {
    track: TrackProps;
    image: TrackItemImage;
    isQueued: boolean;
    isPlaying: boolean;
    isCurrentTrack: boolean;
    onQueueTrack: (id: TrackProps['id']) => void;
    onPressPlayback: (id: TrackProps['id']) => void;
    itemIndex?: number;
}

const TrackItem: React.FC<TrackItemProps> = ({
    track,
    image,
    onPressPlayback,
    onQueueTrack,
    isQueued,
    isPlaying,
    isCurrentTrack,
    itemIndex = 0
}) => {
    const queueTrackHandler = () => {
        onQueueTrack(track.id);
    };

    return (
        <StyledTrackItemContainer>
            {itemIndex > 0 && (
                <StyledTrackItemIndex>
                    <Typography
                        variant={'h6'}
                        color="textPrimary"
                        align="center"
                    >
                        {itemIndex}
                    </Typography>
                </StyledTrackItemIndex>
            )}
            <StyledTrackImg
                $height={image.size}
                $width={image.size}
                src={image.src}
            ></StyledTrackImg>
            <StyledTrackInfo>
                <Typography color="textPrimary" variant="subtitle1" noWrap>
                    {track.songTitle}
                </Typography>
                <Typography variant="body2" color="textSecondary" noWrap>
                    {track.artist}
                </Typography>
            </StyledTrackInfo>
            <StyledTrackPlayerActions>
                <Typography variant="subtitle2" color="textSecondary">
                    {track.duration}
                </Typography>
                <StyledQueueActionContainer>
                    {!isCurrentTrack && (
                        <Tooltip
                            title={`${
                                isQueued ? 'Remove from Queue' : 'Add to Queue'
                            }`}
                        >
                            <IconButton onClick={queueTrackHandler}>
                                {isQueued ? <RemoveIcon /> : <QueueMusicIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
                </StyledQueueActionContainer>
            </StyledTrackPlayerActions>
        </StyledTrackItemContainer>
    );
};

interface TrackImgProps {
    $height: number;
    $width: number;
}

const StyledTrackImg = styled.img<TrackImgProps>`
    height: 32px;
    width: 32px;

    ${props => props.theme.breakpoints.up('sm')} {
        height: ${props => props.$height}px;
        width: ${props => props.$width}px;
    }
`;

const StyledTrackItemContainer = styled(props => <ListItem {...props} />)`
    display: flex;
    flex: 1;
`;

const StyledTrackInfo = styled.div`
    display: flex;
    flex: 1;
    overflow: hidden;
    margin: 0 ${props => props.theme.spacing()}px;
    justify-content: center;
    flex-direction: column;

    ${props => props.theme.breakpoints.up('sm')} {
        margin: 0 ${props => props.theme.spacing(2)}px;
    }
`;

const StyledTrackPlayerActions = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;

    & > *:not(:last-child) {
        margin: 0 ${props => props.theme.spacing(0.5)}px;

        ${props => props.theme.breakpoints.up('sm')} {
            margin: 0 ${props => props.theme.spacing(2)}px;
        }
    }
`;

const StyledQueueActionContainer = styled.div`
    width: 48px;
    height: 48px;
`;

const StyledTrackItemIndex = styled.div`
    display: flex;
    justify-content: center;
    padding-right: ${props => props.theme.spacing(2)}px;
`;

export default TrackItem;
