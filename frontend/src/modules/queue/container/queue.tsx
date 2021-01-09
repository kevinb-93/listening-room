import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Search from '../../shared/components/FormElements/search';

import TrackItem, { TrackItemProps } from '../../spotify/components/track-item';
import Player from '../../spotify/containers/player';
import { useSpotifyPlayerContext } from '../../spotify/context/player';
import Chat from '../../chat/containers/Chat';
import { convertDurationMs } from '../../shared/utils/datetime';
import useSpotifySearch from '../../spotify/hooks/useSpotifySearch';
import { getArtists, getTrackImage } from '../../spotify/utils/track';
import { SpotifyPlayerReducerActionType } from '../../spotify/context/player/reducer/types';

const Queue: React.FC = () => {
    const {
        player,
        queue,
        dispatch,
        playTrack,
        playbackState
    } = useSpotifyPlayerContext();
    const { setSearchTerm, searchResults, searchTerm } = useSpotifySearch();

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
            }
            player.togglePlay();
        },
        [getTrack, isCurrentTrack, playTrack, player]
    );

    const queueTrackHandler = useCallback(
        (id: string) => {
            const isQueued = isTrackQueued(id);

            if (isQueued) {
                dispatch({
                    type: SpotifyPlayerReducerActionType.QueueDelete,
                    payload: { trackId: id }
                });
            } else {
                const track = getTrack(id);
                dispatch({
                    type: SpotifyPlayerReducerActionType.QueueAdd,
                    payload: { track }
                });
            }
        },
        [dispatch, getTrack, isTrackQueued]
    );

    const renderTracks = useMemo(() => {
        return (
            <>
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
                            track={track}
                            image={image}
                            key={t.id}
                        />
                    );
                })}
            </>
        );
    }, [
        isTrackPlaying,
        isTrackQueued,
        pressPlaybackHandler,
        queueTrackHandler,
        tracks
    ]);

    const changeHandler = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    const clearHandler = () => {
        setSearchTerm('');
    };

    return (
        <Container>
            <div>
                {player && <Player />}
                <SearchContainer>
                    <Search
                        onChange={changeHandler}
                        searchTerm={searchTerm}
                        onClear={clearHandler}
                    />
                </SearchContainer>
                <QueueContainer>
                    <TrackList>{renderTracks}</TrackList>
                </QueueContainer>
            </div>
            <Chat />
        </Container>
    );
};

const Container = styled.div`
    display: grid;
    margin: 0 auto;
    grid-gap: 1rem;
    background-color: green;
    justify-items: stretch;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    align-items: start;
`;

const QueueContainer = styled.div`
    justify-self: stretch;
`;

const SearchContainer = styled.div``;

const TrackList = styled.div`
    display: flex;
    flex-direction: column;
`;

export default Queue;
