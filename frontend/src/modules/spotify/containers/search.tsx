import React, { useCallback } from 'react';

import Search from '../../shared/components/FormElements/search';
import { convertDurationMs } from '../../shared/utils/datetime';
import TrackItem, { TrackItemProps } from '../components/track-item';
import { useSpotifyPlayerContext } from '../context/player';
import { SpotifyPlayerReducerActionType } from '../context/player/reducer/types';
import useSpotifySearch from '../hooks/useSpotifySearch';
import { getArtists, getTrackImage } from '../utils/track';

const SpotifySearch: React.FC = () => {
    const { setSearchTerm, searchResults, searchTerm } = useSpotifySearch();
    const {
        queue,
        dispatch,
        playTrack,
        addTrackToQueue,
        deleteTrackFromQueue,
        playbackState,
        player
    } = useSpotifyPlayerContext();

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

    const pressPlaybackHandler = (id: string) => {
        const track = getTrackFromSearchResults(id);

        if (!isCurrentTrack(id)) {
            playTrack(track);
        } else {
            player.togglePlay();
        }
    };

    const getTrackFromSearchResults = useCallback(
        (trackId: string) => {
            return searchResults.tracks.items.find(t => t.id === trackId);
        },
        [searchResults.tracks.items]
    );

    const queueTrackHandler = (id: string) => {
        const isQueued = isTrackQueued(id);

        if (isQueued) {
            deleteTrackFromQueue(id);
            // dispatch({
            //     type: SpotifyPlayerReducerActionType.QueueDelete,
            //     payload: { trackId: id }
            // });
        } else {
            const track = getTrackFromSearchResults(id);
            addTrackToQueue(track);
            // dispatch({
            //     type: SpotifyPlayerReducerActionType.QueueAdd,
            //     payload: { track }
            // });
        }
    };

    const renderSearchResults = () => {
        if (!searchResults) {
            return null;
        }

        return (
            <>
                {searchResults.tracks.items.slice(0, 10).map(t => {
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
                            isCurrentTrack={isCurrentTrack(t.id)}
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
    };

    const changeHandler = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    const clearHandler = () => {
        setSearchTerm('');
    };

    return (
        <Search
            onChange={changeHandler}
            searchTerm={searchTerm}
            searchResults={renderSearchResults()}
            onClear={clearHandler}
        />
    );
};

export default SpotifySearch;
