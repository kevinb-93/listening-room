import React, { useState, useEffect, useCallback } from 'react';
import useSpotifySearch from '../hooks/useSpotifySearch';
import Search from '../../shared/components/FormElements/search';
import SpotifyTrackList from './spotify.track-list';

const SpotifySearch: React.FC = () => {
    const { setSearchTerm, searchResults, searchTerm } = useSpotifySearch();
    const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);

    useEffect(
        function updateTracks() {
            setTracks(searchResults?.tracks?.items);
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
    }, [setSearchTerm]);

    return (
        <Search
            placeholder="Search tracks..."
            onChange={changeHandler}
            searchTerm={searchTerm}
            onClear={clearHandler}
            searchResults={<SpotifyTrackList tracks={tracks} />}
        />
    );
};

export default SpotifySearch;
