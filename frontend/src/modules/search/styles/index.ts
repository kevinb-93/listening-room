import styled from 'styled-components';

const searchIconWidth = '40px';

export const SearchContainer = styled.div`
    display: flex;
    flex: 1 1;
    position: relative;
    justify-content: center;
    align-items: center;
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
    height: 32px;
    padding: 0px 0px 0px ${searchIconWidth};
`;
