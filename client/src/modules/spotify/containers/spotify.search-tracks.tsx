import React, { useState, useEffect, useCallback, memo } from 'react';
import useSpotifySearch from '../hooks/useSpotifySearch';
import SpotifyTrackList from './spotify.track-list';

const SpotifySearch: React.FC = memo(() => {
    const { setSearchTerm, searchResults, searchTerm } = useSpotifySearch();
    const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);

    useEffect(
        function updateTracks() {
            const tracks = searchResults?.tracks?.items ?? [];
            setTracks(tracks);
        },
        [searchResults?.tracks?.items]
    );

    const changeHandler = useCallback(
        (searchTerm: string) => {
            setSearchTerm(searchTerm);
        },
        [setSearchTerm]
    );

    const clearHandler = useCallback(() => {
        setSearchTerm('');
        setTracks([]);
    }, [setSearchTerm]);

    return (
        <Search
            placeholder="Search tracks..."
            onChange={changeHandler}
            searchTerm={searchTerm}
            onClear={clearHandler}
            searchListBoxComponent={
                tracks.length > 0 ? (
                    <SpotifyTrackList tracks={tracks} />
                ) : undefined
            }
        />
    );
});

SpotifySearch.displayName = 'SpotifySearch';

export default SpotifySearch;
