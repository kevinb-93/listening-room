import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Player from '../../shared/components/audio/Player';
import { useSpotifyPlayerContext } from '../../spotify/context/player';
import Chat from '../../chat/containers/chat';
import { useSpotifyIdentityContext } from '../../spotify/context/identity';
import SpotifyAuthButton from '../../spotify/containers/auth';
import Card from '@material-ui/core/Card';
import { CardContent, CardHeader, Typography } from '@material-ui/core';
import SpotifyTrackList from '../../spotify/containers/spotify.track-list';

const Queue: React.FC = () => {
    const { spotifyToken } = useSpotifyIdentityContext();
    const { player, queue, playbackState } = useSpotifyPlayerContext();

    const resumePlayback = useCallback(() => {
        if (!player || !playbackState.paused) {
            return;
        }

        player.resume().then(() => console.log('resumed!'));
    }, [playbackState?.paused, player]);

    const pausePlayback = useCallback(() => {
        if (!player) {
            return;
        }

        if (!playbackState.paused) {
            player.pause().then(() => console.log('paused!'));
        }
    }, [playbackState?.paused, player]);

    const renderPlayer = useMemo(() => {
        const { current_track } = playbackState?.track_window || {};

        return (
            <Player
                artWork={{
                    src: current_track?.album?.images[0]?.url,
                    height: 200,
                    width: 200
                }}
                controls={{
                    playHandler: resumePlayback,
                    pauseHandler: pausePlayback,
                    isPlaying: !(playbackState?.paused ?? true)
                }}
                creatorName={current_track?.artists[0]?.name}
                title={current_track?.name}
                progress={{
                    elaspedTime: playbackState?.position ?? 0,
                    songDurationMs: playbackState?.duration ?? 0
                }}
            />
        );
    }, [
        pausePlayback,
        playbackState?.duration,
        playbackState?.paused,
        playbackState?.position,
        playbackState?.track_window,
        resumePlayback
    ]);

    const renderQueuedTrackList = useCallback(() => {
        if (!queue?.length) return <Typography>Queue is empty.</Typography>;

        return <SpotifyTrackList tracks={queue} />;
    }, [queue]);

    const renderQueue = useMemo(() => {
        return (
            <StyledCard raised>
                <CardHeader title="Queue" />
                <StyledCardContent>{renderQueuedTrackList()}</StyledCardContent>
            </StyledCard>
        );
    }, [renderQueuedTrackList]);

    return (
        <StyledContainer>
            <StyledWrapper>
                {spotifyToken ? (
                    <>
                        {renderPlayer}
                        {renderQueue}
                    </>
                ) : (
                    <SpotifyAuthButton />
                )}
            </StyledWrapper>
            <Chat />
        </StyledContainer>
    );
};

const StyledCardContent = styled(CardContent)`
    padding-top: 0px;
`;

const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    height: 100%;
`;

const StyledCard = styled(Card)`
    height: fit-content;
`;

const StyledWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: ${props => props.theme.spacing()}px;
    padding: ${props => props.theme.spacing()}px;
`;

export default Queue;
