import React from 'react';
import { StyledHeader } from '../styles/header';

const Header: React.FC = ({ children }) => {
    return (
        <StyledHeader>
            <div>Header</div>
            {children}
        </StyledHeader>
    );
};

export default Header;
