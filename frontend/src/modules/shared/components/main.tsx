import React from 'react';
import styled from 'styled-components';

const Main: React.FC = ({ children }) => {
    return <StyledMain>{children}</StyledMain>;
};

const StyledMain = styled.div`
    margin-top: ${(props) => props.theme.header.height};
`;

export default Main;
