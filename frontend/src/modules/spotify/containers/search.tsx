import React, { useCallback, useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import Search from '../../shared/components/FormElements/search';
import { convertDurationMs } from '../../shared/utils/datetime';

const SpotifySearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResponseData, setSearchResponseData] = useState<
        SpotifyApi.SearchResponse
    >();

    const searchHandler = useCallback((searchTerm: string) => {
        const s = new SpotifyWebApi();

        s.search(searchTerm, ['track'], { market: 'from_token' }).then(
            (data) => {
                setSearchResponseData(data);
            },
            (err) => {
                console.log(err);
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
                {searchResponseData.tracks.items.slice(0, 10).map((t) => {
                    return (
                        <div key={t.id} style={{ display: 'flex' }}>
                            <img
                                height={64}
                                width={64}
                                src={
                                    t.album.images.find((i) => i.height === 64)
                                        .url
                                }
                            ></img>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <span>{t.name}</span>
                                <span>
                                    {t.artists.map((a) => a.name).join(', ')}
                                </span>
                                <span>{convertDurationMs(t.duration_ms)}</span>
                            </div>
                        </div>
                    );
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
        console.log('search change handler');
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
