import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

export interface Props {
    color?: string;
    isPlaying?: boolean;
    playHandler: () => void;
    pauseHandler: () => void;
}

const PlayerControls: React.FC<Props> = ({
    color,
    isPlaying,
    playHandler,
    pauseHandler
}) => {
    return (
        <Controls>
            {isPlaying ? (
                <FontAwesomeIcon
                    icon={'pause'}
                    color={color}
                    onClick={pauseHandler}
                />
            ) : (
                <FontAwesomeIcon
                    icon={'play'}
                    color={color}
                    onClick={playHandler}
                />
            )}
        </Controls>
    );
};

PlayerControls.defaultProps = {
    color: '#000'
};

const Controls = styled.div`
    position: relative;
`;

export default PlayerControls;
