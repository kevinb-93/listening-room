import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import TrackItem, {
    TrackItemProps
} from '../../spotify/components/spotify.track-list-item';
import Player from '../../shared/components/audio/Player';
import { useSpotifyPlayerContext } from '../../spotify/context/player';
import Chat from '../../chat/containers/chat';
import { convertDurationMs } from '../../shared/utils/datetime';
import { getArtists, getTrackImage } from '../../spotify/utils/track';
import { useSpotifyIdentityContext } from '../../spotify/context/identity';
import SpotifyAuthButton from '../../spotify/containers/auth';

const Queue: React.FC = () => {
    const { spotifyToken } = useSpotifyIdentityContext();
    const {
        player,
        queue,
        addTrackToQueue,
        deleteTrackFromQueue,
        playTrack,
        playbackState
    } = useSpotifyPlayerContext();

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

    const isTrackQueued = useCallback(
        (trackId: SpotifyApi.TrackObjectFull['id']) => {
            return queue.some(q => q.id === trackId);
        },
        [queue]
    );

    const isCurrentTrack = useCallback(
        (id: string) => {
            return playbackState?.track_window?.current_track?.id === id;
        },
        [playbackState?.track_window?.current_track?.id]
    );

    const isTrackPlaying = useCallback(
        (id: SpotifyApi.TrackObjectFull['id']) => {
            return isCurrentTrack(id) && playbackState?.paused === false;
        },
        [isCurrentTrack, playbackState?.paused]
    );

    const getTrack = useCallback(
        (trackId: string) => {
            return queue.find(t => t.id === trackId);
        },
        [queue]
    );

    const pressPlaybackHandler = useCallback(
        (id: string) => {
            const track = getTrack(id);

            if (!isCurrentTrack(id)) {
                playTrack(track);
            } else {
                player.togglePlay();
            }
        },
        [getTrack, isCurrentTrack, playTrack, player]
    );

    const queueTrackHandler = useCallback(
        (id: string) => {
            const isQueued = isTrackQueued(id);

            if (isQueued) {
                deleteTrackFromQueue(id);
            } else {
                const track = getTrack(id);
                addTrackToQueue(track);
            }
        },
        [addTrackToQueue, deleteTrackFromQueue, getTrack, isTrackQueued]
    );

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

    const renderQueue = useMemo(() => {
        return (
            <StyledQueue>
                <StyledTrackList>
                    {queue.slice(0, 10).map(t => {
                        const track: TrackItemProps['track'] = {
                            id: t.id,
                            artist: getArtists(t),
                            duration: convertDurationMs(t.duration_ms),
                            songTitle: t.name
                        };
                        const image: TrackItemProps['image'] = {
                            src: getTrackImage(t).url,
                            size: 64
                        };

                        const isQueued = isTrackQueued(t.id);
                        const isPlaying = isTrackPlaying(t.id);

                        return (
                            <TrackItem
                                onPressPlayback={pressPlaybackHandler}
                                onQueueTrack={queueTrackHandler}
                                isQueued={isQueued}
                                isPlaying={isPlaying}
                                isCurrentTrack={isCurrentTrack(t.id)}
                                track={track}
                                image={image}
                                key={t.id}
                            />
                        );
                    })}
                </StyledTrackList>
            </StyledQueue>
        );
    }, [
        isCurrentTrack,
        isTrackPlaying,
        isTrackQueued,
        pressPlaybackHandler,
        queueTrackHandler,
        queue
    ]);

    return (
        <StyledContainer>
            <div>
                {spotifyToken ? (
                    <StyledWrapper>
                        {renderPlayer}
                        {renderQueue}
                    </StyledWrapper>
                ) : (
                    <SpotifyAuthButton />
                )}
            </div>
            <Chat />
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    height: 100%;
`;

const StyledQueue = styled.div`
    justify-self: stretch;
`;

const StyledTrackList = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledWrapper = styled.div`
    padding: ${props => props.theme.spacing(1)}px;
`;

export default Queue;
