import React, { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    SearchContainer,
    SearchIcon,
    SearchInput,
} from '../../styles/FormElements/search';

interface Props {
    onChange?: (searchTerm: string) => void;
    value?: HTMLInputElement['value'];
    placeholder?: HTMLInputElement['placeholder'];
}

const Search: React.FC<Props> = ({ onChange, value, placeholder }) => {
    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <SearchContainer>
            <SearchIcon>
                <FontAwesomeIcon icon={'search'} />
            </SearchIcon>
            <SearchInput
                placeholder={placeholder}
                onChange={changeHandler}
                value={value}
            />
        </SearchContainer>
    );
};

Search.defaultProps = {
    placeholder: 'Search',
    value: '',
    onChange: () => null,
};

export default Search;
