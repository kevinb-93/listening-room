import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';

export interface AudioControlsProps {
    color?: string;
    isPlaying?: boolean;
    playHandler: () => void;
    pauseHandler: () => void;
}

const PlayerControls: React.FC<AudioControlsProps> = ({
    color,
    isPlaying,
    playHandler,
    pauseHandler
}) => {
    return (
        <Controls>
            <IconButton onClick={isPlaying ? pauseHandler : playHandler}>
                {isPlaying ? (
                    <Pause fontSize="large" />
                ) : (
                    <PlayArrow fontSize="large" />
                )}
            </IconButton>
        </Controls>
    );
};

PlayerControls.defaultProps = {
    color: '#000'
};

const Controls = styled.div`
    display: flex;
    justify-content: center;
`;

export default PlayerControls;
