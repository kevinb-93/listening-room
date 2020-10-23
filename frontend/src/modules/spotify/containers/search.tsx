import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import Search from '../../shared/components/FormElements/search';

const SpotifySearch: React.FC = () => {
    const s = new SpotifyWebApi();

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (searchTerm) {
            const timer = setTimeout(() => console.log(searchTerm), 1000);
            return () => clearTimeout(timer);
        }
    }, [searchTerm]);

    const changeHandler = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    return <Search onChange={changeHandler} value={searchTerm} />;
};

export default SpotifySearch;
