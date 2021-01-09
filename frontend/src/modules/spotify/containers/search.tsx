import React, { useCallback } from 'react';

import Search from '../../shared/components/FormElements/search';
import { convertDurationMs } from '../../shared/utils/datetime';
import TrackItem, { TrackItemProps } from '../components/track-item';
import { spotifyApi } from '../config/spotify-web-api';
import { useSpotifyPlayerContext } from '../context/player';
// import { playTrack } from '../context/player/actions';
import { SpotifyPlayerReducerActionType } from '../context/player/reducer/types';
import useSpotifySearch from '../hooks/useSpotifySearch';
import { getArtists, getTrackImage } from '../utils/track';

const SpotifySearch: React.FC = () => {
    const { setSearchTerm, searchResults, searchTerm } = useSpotifySearch();
    const { queue, dispatch, playTrack } = useSpotifyPlayerContext();

    const isTrackQueued = useCallback(
        (trackId: SpotifyApi.TrackObjectFull['id']) => {
            return queue.some(q => q.id === trackId);
        },
        [queue]
    );

    const playTrackHandler = (id: string) => {
        const track = getTrackFromSearchResults(id);
        playTrack(track);
        // spotifyApi
        //     .play({ uris: [track.uri] })
        //     .then(() => {
        //         dispatch({
        //             type: SpotifyPlayerReducerActionType.PlayTrack,
        //             payload: track
        //         });
        //         dispatch({
        //             type: SpotifyPlayerReducerActionType.QueueDelete,
        //             payload: { trackId: track.id }
        //         });
        //     })
        //     .catch(e => console.error('Unable to play track', e));
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
            dispatch({
                type: SpotifyPlayerReducerActionType.QueueDelete,
                payload: { trackId: id }
            });
        } else {
            const track = getTrackFromSearchResults(id);
            dispatch({
                type: SpotifyPlayerReducerActionType.QueueAdd,
                payload: { track }
            });
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

                    return (
                        <TrackItem
                            onPlayTrack={playTrackHandler}
                            onQueueTrack={queueTrackHandler}
                            isQueued={isQueued}
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
