import React, { useCallback, useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import Search from '../../shared/components/FormElements/search';
import TrackItem from '../components/track-item';

const SpotifySearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResponseData, setSearchResponseData] = useState<
        SpotifyApi.SearchResponse
    >();

    const searchHandler = useCallback((searchTerm: string) => {
        const s = new SpotifyWebApi();

        s.search(searchTerm, ['track'], { market: 'from_token' }).then(
            data => {
                setSearchResponseData(data);
            },
            err => {
                console.error(err);
            }
        );
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setSearchResponseData(null);
        }
    }, [searchTerm]);

    const renderSearchResults = () => {
        if (!searchResponseData) {
            return null;
        }

        return (
            <>
                {searchResponseData.tracks.items.slice(0, 10).map(t => {
                    return <TrackItem track={t} key={t.id} />;
                })}
            </>
        );
    };

    useEffect(() => {
        if (searchTerm) {
            const timer = setTimeout(() => searchHandler(searchTerm), 1000);
            return () => clearTimeout(timer);
        }
    }, [searchTerm, searchHandler]);

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
