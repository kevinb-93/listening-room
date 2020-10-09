import styled from 'styled-components';

export const StyledMain = styled.div`
    margin-left: ${(props) => props.theme.drawer.width};
    margin-top: ${(props) => props.theme.header.height};
`;
