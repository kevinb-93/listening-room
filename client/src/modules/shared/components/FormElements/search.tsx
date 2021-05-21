import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import styled from 'styled-components';
import {
    IconButton,
    InputAdornment,
    Paper,
    TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import debounce from 'lodash/debounce';

interface Props {
    onChange?: (searchTerm: string) => void;
    onClear?: () => void;
    searchTerm?: HTMLInputElement['value'];
    placeholder?: HTMLInputElement['placeholder'];
    searchListBoxComponent?: JSX.Element;
}

interface SearchListPosition {
    left: number | undefined;
    top: number | undefined;
    width: number | undefined;
}

const defaultPopperWidth = 600;

const Search: React.FC<Props> = ({
    onChange = () => null,
    searchTerm,
    placeholder,
    searchListBoxComponent,
    onClear = () => null
}) => {
    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        onChange(inputValue);
    };

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchPopperRef = useRef<HTMLDivElement>(null);

    const [
        searchListPosition,
        setSearchListPosition
    ] = useState<SearchListPosition>({
        left: undefined,
        top: undefined,
        width: undefined
    });

    const [showResults, setShowResults] = useState<boolean>(false);

    const handleSearchListPosition = useCallback(() => {
        const searchBarRect = searchContainerRef.current?.getBoundingClientRect();
        const searchPopperRect = searchPopperRef.current?.getBoundingClientRect();
        if (!searchBarRect) return;

        const searchContainerCenterPosition =
            searchBarRect.left + searchBarRect.width / 2;

        const popperWidth = searchPopperRect?.width ?? defaultPopperWidth;
        let targetLeftPosition =
            searchContainerCenterPosition - popperWidth / 2;

        if (targetLeftPosition < 0) targetLeftPosition = 0;

        if (
            searchListPosition.left !== targetLeftPosition ||
            searchListPosition.top !== searchBarRect.bottom
        ) {
            setSearchListPosition({
                left: targetLeftPosition,
                top: searchBarRect.bottom,
                width: searchBarRect.width
            });
        }
    }, [searchListPosition.left, searchListPosition.top]);

    useEffect(
        function handleSearchListPositionEffect() {
            if (showResults) handleSearchListPosition();
        },
        [handleSearchListPosition, showResults]
    );

    useEffect(() => {
        console.log('show results');
        if (searchListBoxComponent) setShowResults(true);
    }, [searchListBoxComponent]);

    useEffect(
        function clickOutsideEffect() {
            const clickOutsideHandler = (event: MouseEvent | UIEvent) => {
                if (showResults) {
                    if (
                        event instanceof MouseEvent &&
                        searchContainerRef.current &&
                        !searchContainerRef.current.contains(
                            event.target as Node
                        )
                    ) {
                        setShowResults(false);
                    } else if (event.type === 'resize') {
                        setShowResults(false);
                    }
                }
            };

            const debouncedHandleSearchListPosition = debounce(
                handleSearchListPosition,
                300
            );
            const debouncedClickOutsideHandler = debounce(
                clickOutsideHandler,
                300,
                { leading: true }
            );

            document.addEventListener('mousedown', clickOutsideHandler);
            window.addEventListener('resize', debouncedClickOutsideHandler);
            window.addEventListener(
                'resize',
                debouncedHandleSearchListPosition
            );

            return () => {
                document.removeEventListener('mousedown', clickOutsideHandler);
                window.removeEventListener(
                    'resize',
                    debouncedClickOutsideHandler
                );
                window.removeEventListener(
                    'resize',
                    debouncedHandleSearchListPosition
                );
            };
        },
        [showResults, handleSearchListPosition]
    );

    const keyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchListBoxComponent) {
            setShowResults(true);
        }
    };

    const focusInputHandler = () => {
        console.log('focus');
        if (searchListBoxComponent) setShowResults(true);
    };

    console.log('render');

    return (
        <StyledSearchContainer ref={searchContainerRef}>
            <SearchInput
                placeholder={placeholder}
                variant="outlined"
                onChange={changeHandler}
                value={searchTerm}
                size="small"
                fullWidth
                spellCheck={false}
                margin="none"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <StyledInputAdornment position="end">
                            {searchTerm && (
                                <IconButton
                                    onClick={() => {
                                        onClear();
                                        searchInputRef.current?.focus();
                                    }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </StyledInputAdornment>
                    )
                }}
                inputRef={searchInputRef}
                onKeyUp={keyPressHandler}
                onFocus={focusInputHandler}
            />
            {Boolean(searchListBoxComponent) &&
                showResults &&
                searchListPosition?.top && (
                    <StyledPopperContainer
                        $positionleft={searchListPosition?.left}
                        $positiontop={searchListPosition.top}
                        $width={searchListPosition?.width}
                        elevation={8}
                        ref={searchPopperRef}
                    >
                        <StyledListboxContainer>
                            {searchListBoxComponent}
                        </StyledListboxContainer>
                    </StyledPopperContainer>
                )}
        </StyledSearchContainer>
    );
};

const SearchInput = styled(TextField)``;

const StyledSearchContainer = styled.div``;

const StyledInputAdornment = styled(InputAdornment)`
    width: 48px;
`;

interface PopperProps {
    $positionleft: number | undefined;
    $positiontop: number | undefined;
    $width: number | undefined;
}

const StyledListboxContainer = styled.div`
    overflow: auto;
    max-height: calc(100vh - 100px);
    border-radius: ${props => props.theme.spacing(2)}px;
    display: flex;
    flex: 1;
    color: inherit;
    background-color: inherit;
    flex-direction: column;
`;

const StyledPopperContainer = styled(Paper)<PopperProps>`
    position: fixed;
    width: 100%;
    left: ${props => props.$positionleft}px;
    top: ${props => props.$positiontop}px;
    color: black;
    background-color: white;
    ${props => props.theme.breakpoints.up('md')} {
        width: ${defaultPopperWidth}px;
    }
`;

Search.defaultProps = {
    placeholder: 'Search',
    searchTerm: '',
    onChange: () => null
};

export default Search;
