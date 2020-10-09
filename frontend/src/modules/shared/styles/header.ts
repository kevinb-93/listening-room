import styled from 'styled-components';

export const StyledHeader = styled.div`
    position: fixed;
    height: ${(props) => props.theme.header.height};
    z-index: 2;
    background-color: white;
    left: 0;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 0px 16px;
`;
