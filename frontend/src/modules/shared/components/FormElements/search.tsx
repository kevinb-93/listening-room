import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    SearchContainer,
    SearchInputContainer,
    SearchIcon,
    SearchInput,
    SearchList,
    SearchBarContainer,
    SearchClearIcon,
} from '../../styles/FormElements/search';

interface Props {
    onChange?: (searchTerm: string) => void;
    onClear?: () => void;
    searchTerm?: HTMLInputElement['value'];
    placeholder?: HTMLInputElement['placeholder'];
    searchResults?: JSX.Element;
}

interface SearchListPosition {
    left: number;
    top: number;
    width: number;
}

const Search: React.FC<Props> = ({
    onChange,
    searchTerm,
    placeholder,
    searchResults,
    onClear,
}) => {
    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const searchBarContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [searchListPosition, setSearchListPosition] = useState<
        SearchListPosition
    >();
    const [showResults, setShowResults] = useState<boolean>(false);

    useEffect(() => {
        const searchBarRect = searchBarContainerRef.current.getBoundingClientRect();

        setSearchListPosition({
            left: searchBarRect.left,
            top: searchBarRect.top,
            width: searchBarRect.width,
        });
    }, []);

    useEffect(() => {
        if (showResults) {
            const searchBarRect = searchBarContainerRef.current.getBoundingClientRect();
            if (
                searchListPosition.left !== searchBarRect.left ||
                searchListPosition.top !== searchBarRect.top
            ) {
                setSearchListPosition({
                    left: searchBarRect.left,
                    top: searchBarRect.top,
                    width: searchBarRect.width,
                });
            }
        }
    }, [searchListPosition, showResults]);

    useEffect(() => {
        if (searchResults) {
            setShowResults(true);
        }
    }, [searchResults]);

    useEffect(() => {
        /**
         * Alert when clicked outside element
         */
        const clickOutsideHandler = (event: MouseEvent | UIEvent) => {
            if (showResults) {
                if (
                    event instanceof MouseEvent &&
                    searchBarContainerRef.current &&
                    !searchBarContainerRef.current.contains(
                        event.target as Node
                    )
                ) {
                    setShowResults(false);
                } else if (event.type === 'resize') {
                    setShowResults(false);
                }
            }
        };

        document.addEventListener('mousedown', clickOutsideHandler);
        window.addEventListener('resize', clickOutsideHandler);

        return () => {
            document.removeEventListener('mousedown', clickOutsideHandler);
            window.removeEventListener('resize', clickOutsideHandler);
        };
    }, [showResults]);

    const keyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setShowResults(true);
        }
    };

    return (
        <SearchContainer>
            <SearchBarContainer ref={searchBarContainerRef}>
                <SearchInputContainer>
                    <SearchIcon onClick={() => setShowResults(true)}>
                        <FontAwesomeIcon icon={'search'} />
                    </SearchIcon>
                    <SearchInput
                        placeholder={placeholder}
                        onChange={changeHandler}
                        value={searchTerm}
                        ref={searchInputRef}
                        onKeyUp={keyPressHandler}
                        onFocus={() => setShowResults(true)}
                    />
                    {searchTerm && (
                        <SearchClearIcon
                            onClick={() => {
                                searchInputRef.current.focus();
                                onClear();
                            }}
                        >
                            <FontAwesomeIcon icon={'times'} />
                        </SearchClearIcon>
                    )}
                </SearchInputContainer>
                {searchResults && showResults && (
                    <SearchList
                        positionLeft={searchListPosition.left}
                        positionTop={searchListPosition.top}
                        width={searchListPosition.width}
                    >
                        {searchResults}
                    </SearchList>
                )}
            </SearchBarContainer>
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
