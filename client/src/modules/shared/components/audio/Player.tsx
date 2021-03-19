import React from 'react';
import styled from 'styled-components';
import AudioControls, { AudioControlsProps } from './audio-controls';
import ProgressBar, { ProgressBarProps } from '../UIElements/progress-bar';
import Card from '@material-ui/core/Card';
import { CardContent, CardMedia, Typography } from '@material-ui/core';

export interface PlayerProps {
    artWork: PlayerArtWork;
    creatorName: string;
    title: string;
    controls: AudioControlsProps;
    progress: ProgressBarProps;
}

export interface PlayerArtWork {
    src: string;
    height: number;
    width: number;
}

const Player: React.FC<PlayerProps> = ({
    artWork,
    creatorName,
    title,
    controls,
    progress
}) => {
    return (
        <StyledContainer raised>
            <StyledMedia {...artWork} />
            <StyledPlayerContainer>
                <StyledTrackDetails>
                    <StyledCreatorName variant="h5">
                        {creatorName}
                    </StyledCreatorName>
                    <StyledTitle variant="subtitle1" color="textSecondary">
                        {title}
                    </StyledTitle>
                </StyledTrackDetails>
                <StyledControls>
                    <AudioControls {...controls} />
                    <ProgressBar {...progress} />
                </StyledControls>
            </StyledPlayerContainer>
        </StyledContainer>
    );
};

const StyledMedia = styled((props: PlayerArtWork) => (
    <CardMedia component="img" {...props} />
))`
    height: ${props => props.height}px;
    width: ${props => props.width}px;
`;

const StyledTrackDetails = styled.div`
    flex: 1;
`;

const StyledControls = styled.div`
    flex: 0;
`;

const StyledTitle = styled(Typography)``;

const StyledCreatorName = styled(Typography)``;

const StyledPlayerContainer = styled(CardContent)`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const StyledContainer = styled(Card)`
    display: flex;
    flex-direction: row;
    color: black;
    height: min-content;
`;

export default Player;
