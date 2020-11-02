import React from 'react';
import styled from 'styled-components';
import { convertDurationMs } from '../../utils/datetime';

interface Props {
    elaspedTime: number;
    songDurationMs: number;
}

const ProgressBar: React.FC<Props> = ({ elaspedTime, songDurationMs }) => {
    return (
        <Container>
            <ElaspedTime>{convertDurationMs(elaspedTime)}</ElaspedTime>
            <ProgressBarContainer>
                <Progress elaspedTime={elaspedTime} duration={songDurationMs} />
            </ProgressBarContainer>
            <Duration>{convertDurationMs(songDurationMs)}</Duration>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    color: #fff;
    position: relative;
    width: 200px;
    align-items: center;
`;

const ProgressBarContainer = styled.div`
    align-self: center;
    position: relative;
    display: flex;
    flex: 1 1;
    height: 5px;
    border: 1px solid #fff;
    border-radius: 2.5px;
`;

interface ProgressProps {
    elaspedTime: number;
    duration: number;
}

const Progress = styled.div.attrs<ProgressProps>((props) => ({
    style: {
        width: `${(props.elaspedTime / props.duration) * 100}%`,
    },
}))<ProgressProps>`
    background-color: #fff;
`;

const ElaspedTime = styled.div`
    flex: 0 0;
    padding-right: 8px;
`;

const Duration = styled.div`
    flex: 0 0;
    padding-left: 8px;
`;

export default ProgressBar;
