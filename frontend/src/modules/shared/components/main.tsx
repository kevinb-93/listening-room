import React from 'react';
import styled from 'styled-components';
import { useIdentityContext } from '../contexts/identity';

const Main: React.FC = ({ children }) => {
    const { isLoggedIn } = useIdentityContext();

    return <StyledMain useHeaderHeight={isLoggedIn()}>{children}</StyledMain>;
};

interface StyledMain {
    useHeaderHeight: boolean;
}

const StyledMain = styled.div<StyledMain>`
    margin-top: ${(props) =>
        props.useHeaderHeight ? props.theme.header.height : ''};
    height: 100%;
    width: 100%;
`;

export default Main;
