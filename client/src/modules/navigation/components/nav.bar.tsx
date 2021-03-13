import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import useAppIdentity from '../../shared/hooks/use-identity';

const Header: React.FC = ({ children }) => {
    const { logout } = useAppIdentity();
    return (
        <StyledHeader>
            <AppBar>
                <Toolbar>
                    <StyledToolbarMenu>
                        <span>Header</span>
                        {children}
                    </StyledToolbarMenu>
                    <Button onClick={logout}>Log out</Button>
                </Toolbar>
            </AppBar>
        </StyledHeader>
    );
};

const StyledToolbarMenu = styled.div`
    flex-grow: 1;
`;

const StyledHeader = styled.div`
    position: fixed;
    height: ${props => props.theme.header.height};
    z-index: 2;
    background-color: white;
    left: 0;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 0px 16px;
`;

export default Header;
