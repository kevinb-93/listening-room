import React from 'react';
import { StyledSideNav } from '../styles';

const SideNav: React.FC = ({ children }) => {
    return <StyledSideNav>{children}</StyledSideNav>;
};

export default SideNav;
