import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { convertDurationMs } from '../../utils/datetime';

interface Props {
    isPlaying: boolean;
    elaspedTime: number;
    songDurationMs: number;
}

const ProgressBar: React.FC<Props> = ({
    elaspedTime: startingTime,
    isPlaying,
    songDurationMs,
}) => {
    const requestAnimationRef = useRef<number>(0);
    const prevTimeRef = useRef<number>(undefined);

    const [elaspedTime, setElaspedTime] = useState<number>(startingTime);

    const animate = useCallback((time) => {
        if (prevTimeRef.current === undefined) {
            prevTimeRef.current = time;
        }

        const elasped = time - prevTimeRef.current;

        requestAnimationRef.current = requestAnimationFrame(animate);
        setElaspedTime((et) => et + elasped);
        prevTimeRef.current = time;
    }, []);

    useEffect(() => {
        if (elaspedTime > songDurationMs) {
            cancelAnimationFrame(requestAnimationRef.current);
        }
    }, [elaspedTime, songDurationMs]);

    useEffect(() => {
        if (!isPlaying) {
            prevTimeRef.current = undefined;
            cancelAnimationFrame(requestAnimationRef.current);
        } else if (isPlaying) {
            requestAnimationRef.current = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(requestAnimationRef.current);
    }, [animate, isPlaying]);

    return (
        <Container>
            <ElaspedTime>{convertDurationMs(elaspedTime)}</ElaspedTime>
            <ProgressBarContainer>
                <Progress
                    elaspedTime={elaspedTime}
                    isPlaying={isPlaying}
                    duration={songDurationMs}
                />
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
    elaspedTime?: number;
    isPlaying: boolean;
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
