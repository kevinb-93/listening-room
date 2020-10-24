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

export const SearchListContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: absolute;
    left: 0;
    right: 0;
    top: ${searchInputHeight};
    flex-direction: column;
    justify-content: center;
    align-items: start;
    background-color: red;
`;

export const SearchIcon = styled.span`
    display: flex;
    width: ${searchIconWidth};
    top: 0;
    left: ${searchIconWidth};
    bottom: 0;
    align-items: center;
    justify-content: center;
    position: relative;
`;

export const SearchInput = styled.input`
    flex: 1 1;
    max-width: 500px;
    height: ${searchInputHeight};
    padding: 0px 0px 0px ${searchIconWidth};
`;
