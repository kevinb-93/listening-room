import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
}

const TrackItem: React.FC<TrackItemProps> = ({
    track,
    image,
    onPressPlayback,
    onQueueTrack,
    isQueued,
    isPlaying,
    isCurrentTrack
}) => {
    const queueIcon: IconProp = isQueued ? 'times' : 'plus';
    const playbackIcon: IconProp = isPlaying ? 'pause' : 'play';

    const queueTrackHandler = () => {
        onQueueTrack(track.id);
    };

    const pressPlaybackHandler = () => {
        onPressPlayback(track.id);
    };

    return (
        <StyledTrackItemContainer>
            <img height={image.size} width={image.size} src={image.src}></img>
            <StyledTrackInfo>
                <span>{track.songTitle}</span>
                <span>{track.artist}</span>
                <span>{track.duration}</span>
            </StyledTrackInfo>
            <StyledTrackPlayerActions>
                {!isCurrentTrack && (
                    <span onClick={queueTrackHandler}>
                        <FontAwesomeIcon fixedWidth icon={queueIcon} />
                    </span>
                )}
                <span onClick={pressPlaybackHandler}>
                    <FontAwesomeIcon fixedWidth icon={playbackIcon} />
                </span>
            </StyledTrackPlayerActions>
        </StyledTrackItemContainer>
    );
};

const StyledTrackItemContainer = styled.li`
    display: flex;
    padding: ${props => props.theme.spacing(1)}px;
    flex: 1;

    &:hover {
        background-color: red;
    }
`;

const StyledTrackInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledTrackPlayerActions = styled.div`
    display: flex;
    flex-direction: column;
`;

export default TrackItem;
