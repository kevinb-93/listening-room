import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

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

const searchIconWidth = '40px';
const searchInputHeight = '32px';

const SearchContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: relative;
    justify-content: center;
    align-items: center;
`;

const SearchInputContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: relative;
    justify-content: center;
    align-items: center;
`;

const SearchBarContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: relative;
    justify-content: center;
    align-items: center;
`;

interface SearchListProps {
    positionLeft: number;
    positionTop: number;
    width: number;
}

const SearchList = styled.div<SearchListProps>`
    display: flex;
    flex: 1 1;
    position: fixed;
    left: ${(props) => props.positionLeft}px;
    top: ${(props) => props.positionTop + parseInt(searchInputHeight)}px;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    width: ${(props) => props.width}px;
    background-color: green;
`;

const SearchIcon = styled.span`
    display: flex;
    width: ${searchIconWidth};
    top: 0;
    left: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    position: absolute;
`;

const SearchClearIcon = styled.span`
    display: flex;
    width: ${searchIconWidth};
    top: 0;
    right: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    position: absolute;
`;

const SearchInput = styled.input`
    flex: 1 1;
    height: ${searchInputHeight};
    padding: 0px 0px 0px ${searchIconWidth};
`;

Search.defaultProps = {
    placeholder: 'Search',
    searchTerm: '',
    onChange: () => null,
    searchResults: null,
};

export default Search;
