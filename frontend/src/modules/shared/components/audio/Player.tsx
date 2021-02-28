import React from 'react';
import styled from 'styled-components';
import AudioControls, { AudioControlsProps } from './audio-controls';
import ProgressBar, { ProgressBarProps } from '../UIElements/progress-bar';

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
        <StyledPlayerContainer>
            <StyledArtWork
                src={artWork.src}
                height={artWork.height}
                width={artWork.width}
            />
            <StyledCreatorName>{creatorName}</StyledCreatorName>
            <StyledTitle>{title}</StyledTitle>
            <AudioControls color="#fff" {...controls} />
            <ProgressBar {...progress} />
        </StyledPlayerContainer>
    );
};

const StyledArtWork = styled.img`
    position: relative;
`;

const StyledTitle = styled.span`
    color: inherit;
    position: relative;
`;

const StyledCreatorName = styled.span`
    color: inherit;
    position: relative;
`;

const StyledPlayerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    padding: 16px 0px 16px 0px;
`;

export default Player;
