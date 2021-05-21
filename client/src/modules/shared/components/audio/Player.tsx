import React from 'react';
import styled from 'styled-components';
import AudioControls, { AudioControlsProps } from './audio-controls';
import ProgressBar, { ProgressBarProps } from '../UIElements/progress-bar';
import Card from '@material-ui/core/Card';
import { CardContent, CardMedia, Typography } from '@material-ui/core';
import AlbumIcon from '@material-ui/icons/Album';

export interface PlayerProps {
    image?: string;
    creatorName: string;
    title: string;
    controls: AudioControlsProps;
    progress: ProgressBarProps;
}

const Player: React.FC<PlayerProps> = ({
    image = '',
    creatorName,
    title,
    controls,
    progress
}) => {
    return (
        <StyledCard>
            <StyledMediaContainer>
                <StyledImageContainer>
                    {image ? (
                        <CardMedia component="img" src={image} />
                    ) : (
                        <StyledAlbumIcon />
                    )}
                </StyledImageContainer>
            </StyledMediaContainer>
            <StyledCardContent>
                <StyledTrackDetails>
                    <StyledTitle variant="h5" noWrap>
                        {title}
                    </StyledTitle>
                    <StyledCreatorName
                        noWrap
                        variant="subtitle2"
                        color="textSecondary"
                    >
                        {creatorName}
                    </StyledCreatorName>
                </StyledTrackDetails>
                <StyledControls>
                    <AudioControls {...controls} />
                    <ProgressBar {...progress} />
                </StyledControls>
            </StyledCardContent>
        </StyledCard>
    );
};

const StyledAlbumIcon = styled(AlbumIcon)`
    height: inherit;
    width: inherit;
    color: ${props => props.theme.palette.text.secondary};
`;

const StyledImageContainer = styled.div`
    height: 200px;
    width: 200px;
`;

const StyledMediaContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;

    ${props => props.theme.breakpoints.up('md')} {
        flex: 0;
        justify-content: flex-start;
    }
`;

const StyledTrackDetails = styled.div`
    flex: 1;
    align-self: center;
    max-width: 100%;
    text-align: center;

    ${props => props.theme.breakpoints.up('md')} {
        align-self: flex-start;
        text-align: unset;
    }
`;

const StyledControls = styled.div`
    flex: 0;
`;

const StyledTitle = styled(Typography)``;

const StyledCreatorName = styled(Typography)``;

const StyledCardContent = styled(CardContent)`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
`;

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    padding: ${props => props.theme.spacing(2)}px;

    ${props => props.theme.breakpoints.up('md')} {
        flex-direction: row;
    }
`;

export default Player;
