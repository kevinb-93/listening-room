import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import useAppIdentity from '../../shared/hooks/use-identity';

const Header: React.FC = ({ children }) => {
    const { logout } = useAppIdentity();

    return (
        <StyledAppBar position="static">
            <Toolbar>
                <StyledToolbarMenu>{children}</StyledToolbarMenu>
                <Button onClick={logout}>Log out</Button>
            </Toolbar>
        </StyledAppBar>
    );
};

const StyledToolbarMenu = styled.div`
    flex-grow: 1;
`;

const StyledAppBar = styled(AppBar)`
    z-index: 2;
    background-color: white;
    display: flex;
`;

export default Header;
