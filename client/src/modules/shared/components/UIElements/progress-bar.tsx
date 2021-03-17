import Slider from '@material-ui/core/Slider';
import React from 'react';
import styled from 'styled-components';
import { convertDurationMs } from '../../utils/datetime';

export interface ProgressBarProps {
    elaspedTime: number;
    songDurationMs: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    elaspedTime,
    songDurationMs
}) => {
    return (
        <StyledContainer>
            <StyledElaspedTime>
                {convertDurationMs(elaspedTime)}
            </StyledElaspedTime>
            <Slider value={elaspedTime} max={songDurationMs} />
            <StyledDuration>{convertDurationMs(songDurationMs)}</StyledDuration>
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    display: flex;
    min-width: 200px;
    justify-content: center;
    align-items: center;
`;

const StyledElaspedTime = styled.div`
    flex: 0 0;
    padding-right: 8px;
`;

const StyledDuration = styled.div`
    flex: 0 0;
    padding-left: 8px;
`;

export default ProgressBar;
