import React from 'react';
import styled from 'styled-components';

const Header: React.FC = ({ children }) => {
    return (
        <StyledHeader>
            <div>Header</div>
            {children}
        </StyledHeader>
    );
};

const StyledHeader = styled.div`
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

export default Header;
