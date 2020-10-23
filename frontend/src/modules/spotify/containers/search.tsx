import React, { useCallback, useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import Search from '../../shared/components/FormElements/search';

const SpotifySearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const searchHandler = useCallback((searchTerm: string) => {
        const s = new SpotifyWebApi();

        s.search(searchTerm, ['track'], { market: 'from_token' }).then(
            (data) => {
                console.log(data);
            },
            (err) => {
                console.log(err);
            }
        );
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const timer = setTimeout(() => searchHandler(searchTerm), 1000);
            return () => clearTimeout(timer);
        }
    }, [searchTerm, searchHandler]);

    const changeHandler = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    return <Search onChange={changeHandler} value={searchTerm} />;
};

export default SpotifySearch;
