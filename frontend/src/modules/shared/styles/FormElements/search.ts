import styled from 'styled-components';

const searchIconWidth = '40px';
const searchInputHeight = '32px';

export const SearchGridContainer = styled.div`
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: ${searchInputHeight} auto;
    position: relative;
`;

export const SearchContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: relative;
    justify-content: center;
    align-items: center;
`;

export const SearchInputContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: relative;
    justify-content: center;
    align-items: center;
`;

export const SearchBarContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: relative;
    justify-content: center;
    align-items: center;
    max-width: 500px;
`;

export const SearchListContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: absolute;
    left: 0;
    right: 0;
    top: ${searchInputHeight};
    justify-content: center;
    align-items: center;
    background-color: red;
`;

interface SearchListProps {
    positionLeft: number;
    positionTop: number;
    width: number;
}

export const SearchList = styled.div<SearchListProps>`
    display: flex;
    flex: 1 1;
    position: fixed;
    left: ${(props) => props.positionLeft}px;
    top: ${(props) => props.positionTop + parseInt(searchInputHeight)}px;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    width: ${(props) => props.width}px;
    max-width: 500px;
    background-color: green;
`;

export const SearchIcon = styled.span`
    display: flex;
    width: ${searchIconWidth};
    top: 0;
    left: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    position: absolute;
`;

export const SearchClearIcon = styled.span`
    display: flex;
    width: ${searchIconWidth};
    top: 0;
    right: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    position: absolute;
`;

export const SearchInput = styled.input`
    flex: 1 1;
    max-width: 500px;
    height: ${searchInputHeight};
    padding: 0px 0px 0px ${searchIconWidth};
`;
