import { useState, useCallback, useEffect, useRef } from 'react';
import { spotifyApi } from '../config/spotify-web-api';

interface SpotifySearch {
    searchTerm: string;
    searchResults: SpotifyApi.SearchResponse;
    searchTrack: () => void;
    setSearchTerm: (term: SpotifySearch['searchTerm']) => void;
}

type SpotifySearchHook = () => SpotifySearch;

const useSpotifySearch: SpotifySearchHook = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<
        SpotifyApi.SearchResponse
    >();

    const searchTimeout = useRef<number>();

    const searchTrack = useCallback(() => {
        spotifyApi.search(searchTerm, ['track'], { market: 'from_token' }).then(
            data => {
                setSearchResults(data);
            },
            err => {
                console.error(err);
            }
        );
    }, [searchTerm]);

    const clearSearchTimeout = useCallback(() => {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = undefined;
    }, []);

    const clearSearchResults = useCallback(() => {
        if (!searchTerm) {
            clearSearchTimeout();
            setSearchResults(null);
        }
    }, [clearSearchTimeout, searchTerm]);

    useEffect(() => {
        clearSearchResults();
    }, [clearSearchResults]);

    const setSearchDelayTimer = useCallback(() => {
        if (!searchTerm) {
            return null;
        }

        if (searchTimeout.current) {
            clearSearchTimeout();
        }

        searchTimeout.current = setTimeout(() => searchTrack(), 1000);
    }, [clearSearchTimeout, searchTerm, searchTrack]);

    useEffect(() => {
        setSearchDelayTimer();

        return () => clearSearchTimeout();
    }, [clearSearchTimeout, setSearchDelayTimer]);

    return { searchTerm, searchTrack, setSearchTerm, searchResults };
};

export default useSpotifySearch;
