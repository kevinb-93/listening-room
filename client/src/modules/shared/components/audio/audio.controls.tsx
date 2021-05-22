import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause, SkipNext } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';

export interface AudioControlsProps {
    playControl: {
        isPaused: boolean;
        onPress: () => void;
    };
    playNextControl?: {
        isDisabled: boolean;
        onPress: () => void;
    };
}

const PlayerControls: React.FC<AudioControlsProps> = ({
    playControl,
    playNextControl = {
        isDisabled: false,
        onPress: () => null
    }
}) => {
    return (
        <Controls>
            <Tooltip
                title={`${playControl.isPaused ? 'Play' : 'Pause'}`}
                placement="top"
            >
                <IconButton onClick={playControl.onPress}>
                    {playControl.isPaused ? (
                        <PlayArrow fontSize="large" />
                    ) : (
                        <Pause fontSize="large" />
                    )}
                </IconButton>
            </Tooltip>
            <Tooltip title="Next" placement="top">
                <span>
                    <IconButton
                        disabled={playNextControl.isDisabled}
                        onClick={playNextControl.onPress}
                    >
                        <SkipNext fontSize="large" />
                    </IconButton>
                </span>
            </Tooltip>
        </Controls>
    );
};

const Controls = styled.div`
    display: flex;
    justify-content: center;
    gap: ${props => props.theme.spacing()}px;
`;

export default PlayerControls;
