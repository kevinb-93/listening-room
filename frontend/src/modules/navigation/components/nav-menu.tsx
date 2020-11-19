import React from 'react';
import styled from 'styled-components';

const NavMenu: React.FC<StyledProps> = ({ vertical, children }) => {
    return <StyledNavMenu vertical={vertical}>{children}</StyledNavMenu>;
};

interface StyledProps {
    vertical?: boolean;
}

const StyledNavMenu = styled.div<StyledProps>`
    display: flex;
    flex-direction: ${props => (props.vertical ? 'column' : 'row')};
`;

StyledNavMenu.defaultProps = {
    vertical: false
};

export default NavMenu;
