import React, { MouseEventHandler, useState } from 'react';
import styled from 'styled-components';
import {
    AppBar,
    Toolbar,
    Button,
    Avatar,
    ButtonBase,
    Popover,
    Paper,
    Typography,
    Divider
} from '@material-ui/core';
import useAppIdentity from '../modules/shared/hooks/use-identity';
import { useUserProfileContext } from '../modules/user/contexts/profile';
import { getUserInitials } from '../modules/user/helpers/user.name-helpers';

const Header: React.FC = ({ children }) => {
    const { logout } = useAppIdentity();
    const { user } = useUserProfileContext();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const avatarClickHandler: MouseEventHandler<HTMLButtonElement> = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <StyledAppBar position="static" elevation={0}>
            <Toolbar>
                <StyledToolbarMenu>{children}</StyledToolbarMenu>
                <ButtonBase onClick={avatarClickHandler}>
                    <Avatar variant="circular">
                        {getUserInitials(user.name)}
                    </Avatar>
                </ButtonBase>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    anchorReference="anchorEl"
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                >
                    <StyledPaper elevation={8}>
                        <StyledPaperHeader>
                            <Typography variant="subtitle2">
                                {user.name}
                            </Typography>
                        </StyledPaperHeader>
                        <Divider />
                        <StyledPaperFooter>
                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </StyledPaperFooter>
                    </StyledPaper>
                </Popover>
            </Toolbar>
        </StyledAppBar>
    );
};

const StyledToolbarMenu = styled.div`
    flex-grow: 1;
`;

const StyledPaperHeader = styled.div`
    padding: ${props => props.theme.spacing(2)}px;
`;

const StyledPaperFooter = styled.div`
    padding: ${props => props.theme.spacing(2)}px;
`;

const StyledPaper = styled(Paper)`
    width: 240px;
`;

const StyledAppBar = styled(AppBar)`
    z-index: 2;
    display: flex;
`;

export default Header;
