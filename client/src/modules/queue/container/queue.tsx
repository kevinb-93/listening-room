import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Search from '../../shared/components/FormElements/search';
import TrackItem, { TrackItemProps } from '../../spotify/components/track-item';
import Player from '../../shared/components/audio/Player';
import { useSpotifyPlayerContext } from '../../spotify/context/player';
import Chat from '../../chat/containers/chat';
import { convertDurationMs } from '../../shared/utils/datetime';
import useSpotifySearch from '../../spotify/hooks/useSpotifySearch';
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
    const { setSearchTerm, searchResults, searchTerm } = useSpotifySearch();

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

    const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);

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
    const getTrackList = useCallback(() => {
        if (searchResults?.tracks?.items?.length > 0) {
            setTracks(searchResults.tracks.items);
        } else {
            setTracks(queue);
        }
    }, [queue, searchResults?.tracks?.items]);

    useEffect(() => {
        getTrackList();
    }, [getTrackList]);

    const getTrack = useCallback(
        (trackId: string) => {
            return tracks.find(t => t.id === trackId);
        },
        [tracks]
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

    const changeHandler = useCallback(
        (searchTerm: string) => {
            setSearchTerm(searchTerm);
        },
        [setSearchTerm]
    );

    const clearHandler = useCallback(() => {
        setSearchTerm('');
    }, [setSearchTerm]);

    const renderSearch = useMemo(() => {
        return (
            <div>
                <Search
                    onChange={changeHandler}
                    searchTerm={searchTerm}
                    onClear={clearHandler}
                />
            </div>
        );
    }, [changeHandler, clearHandler, searchTerm]);

    const renderQueue = useMemo(() => {
        return (
            <StyledQueue>
                <StyledTrackList>
                    {tracks.slice(0, 10).map(t => {
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
        tracks
    ]);

    return (
        <StyledContainer>
            <div>
                {spotifyToken ? (
                    <>
                        {renderPlayer}
                        {renderSearch}
                        {renderQueue}
                    </>
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
    margin: 0 auto;
    grid-gap: 1rem;
    background-color: green;
    justify-items: stretch;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    align-items: start;
`;

const StyledQueue = styled.div`
    justify-self: stretch;
`;

const StyledTrackList = styled.div`
    display: flex;
    flex-direction: column;
`;

export default Queue;
