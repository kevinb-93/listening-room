import React, { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    SearchContainer,
    SearchInputContainer,
    SearchListContainer,
    SearchIcon,
    SearchInput,
} from '../../styles/FormElements/search';

interface Props {
    onChange?: (searchTerm: string) => void;
    searchTerm?: HTMLInputElement['value'];
    placeholder?: HTMLInputElement['placeholder'];
    searchResults?: JSX.Element;
}

const Search: React.FC<Props> = ({
    onChange,
    searchTerm,
    placeholder,
    searchResults,
}) => {
    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <SearchContainer>
            <SearchInputContainer>
                <SearchIcon>
                    <FontAwesomeIcon icon={'search'} />
                </SearchIcon>
                <SearchInput
                    placeholder={placeholder}
                    onChange={changeHandler}
                    value={searchTerm}
                />
            </SearchInputContainer>
            {searchResults && (
                <SearchListContainer>{searchResults}</SearchListContainer>
            )}
        </SearchContainer>
    );
};

Search.defaultProps = {
    placeholder: 'Search',
    searchTerm: '',
    onChange: () => null,
    searchResults: null,
};

export default Search;
