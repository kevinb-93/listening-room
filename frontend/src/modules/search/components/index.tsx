import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchContainer, SearchIcon, SearchInput } from '../styles';

const Search: React.FC = () => {
    return (
        <SearchContainer>
            <SearchIcon>
                <FontAwesomeIcon icon={'search'} />
            </SearchIcon>
            <SearchInput placeholder={'Search'} />
        </SearchContainer>
    );
};

export default Search;
