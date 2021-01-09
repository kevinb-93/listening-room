import React, { useCallback } from 'react';
import styled from 'styled-components';

import AudioControls from '../../shared/components/audio/audio-controls';
import ProgressBar from '../../shared/components/UIElements/progress-bar';
import { useSpotifyPlayerContext } from '../context/player';

const Player: React.FC = () => {
    const { playbackState, player } = useSpotifyPlayerContext();

    const resumePlayback = useCallback(() => {
        if (playbackState.paused) {
            player.resume().then(() => console.log('resumed!'));
        }
    }, [playbackState?.paused, player]);

    const pausePlayback = useCallback(() => {
        if (!playbackState.paused) {
            player.pause().then(() => console.log('paused!'));
        }
    }, [playbackState?.paused, player]);

    if (!playbackState?.track_window?.current_track) {
        return null;
    }

    return (
        <PlayerContainer>
            {/* <ArtistImg src={artistFullInfo?.images[0]?.url} /> */}
            <Album
                src={
                    playbackState.track_window.current_track.album.images[0].url
                }
                height={200}
                width={200}
            />
            <ArtistName>
                {playbackState.track_window.current_track.artists[0].name}
            </ArtistName>
            <SongTitle>
                {playbackState.track_window.current_track.name}
            </SongTitle>
            <AudioControls
                color="#fff"
                isPlaying={!playbackState.paused}
                playHandler={resumePlayback}
                pauseHandler={pausePlayback}
            />
            <ProgressBar
                elaspedTime={playbackState.position}
                songDurationMs={playbackState.duration}
            />
        </PlayerContainer>
    );
};

export interface StyledPlayer {
    backgroundImg: string;
}

const Album = styled.img`
    position: relative;
`;

const SongTitle = styled.span`
    color: inherit;
    position: relative;
`;

const ArtistName = styled.span`
    color: inherit;
    position: relative;
`;

const PlayerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    padding: 16px 0px 16px 0px;
`;

export default Player;
