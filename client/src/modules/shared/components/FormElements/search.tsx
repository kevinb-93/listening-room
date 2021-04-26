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
    left: number | undefined;
    top: number | undefined;
    width: number | undefined;
}

const Search: React.FC<Props> = ({
    onChange,
    searchTerm,
    placeholder,
    searchResults,
    onClear
}) => {
    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(event.target.value);
    };

    const searchBarContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [
        searchListPosition,
        setSearchListPosition
    ] = useState<SearchListPosition>({
        left: undefined,
        top: undefined,
        width: undefined
    });
    const [showResults, setShowResults] = useState<boolean>(false);

    useEffect(() => {
        if (showResults) {
            const searchBarRect = searchBarContainerRef.current?.getBoundingClientRect();
            if (
                searchListPosition.left !== searchBarRect?.left ||
                searchListPosition.top !== searchBarRect?.top
            ) {
                setSearchListPosition({
                    left: searchBarRect?.left,
                    top: searchBarRect?.top,
                    width: searchBarRect?.width
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
        <SearchBarContainer ref={searchBarContainerRef}>
            <SearchInputContainer>
                <SearchIcon onClick={() => setShowResults(true)}>
                    <FontAwesomeIcon color="black" icon={'search'} />
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
                            searchInputRef.current?.focus();
                            if (onClear) onClear();
                        }}
                    >
                        <FontAwesomeIcon icon={'times'} />
                    </SearchClearIcon>
                )}
            </SearchInputContainer>
            {searchResults && showResults && (
                <SearchList
                    positionLeft={searchListPosition?.left}
                    positionTop={searchListPosition?.top}
                    width={searchListPosition?.width}
                >
                    {searchResults}
                </SearchList>
            )}
        </SearchBarContainer>
    );
};

const searchIconWidth = '40px';
const searchInputHeight = '32px';

const SearchInputContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: relative;
    justify-content: center;
    align-items: center;
`;

const SearchInput = styled.input`
    flex: 1 1;
    height: ${searchInputHeight};
    padding: 0px 0px 0px ${searchIconWidth};
`;

const SearchBarContainer = styled.div`
    display: flex;
    flex: 1;
    position: relative;
    justify-content: center;
    align-items: center;
    transition: ${props => props.theme.transitions.create('flex')};

    ${SearchInput}:focus & {
        flex: 1;
    }
`;

interface SearchListProps {
    positionLeft: number | undefined;
    positionTop: number | undefined;
    width: number | undefined;
}

const SearchList = styled.div<SearchListProps>`
    display: flex;
    flex: 1 1;
    position: fixed;
    left: ${props => props.positionLeft}px;
    top: ${props => (props.positionTop ?? 0) + parseInt(searchInputHeight)}px;
    flex-direction: column;
    justify-content: center;
    width: ${props => props.width}px;
    color: black;
    background-color: white;
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

Search.defaultProps = {
    placeholder: 'Search',
    searchTerm: '',
    onChange: () => null,
    searchResults: undefined
};

export default Search;
