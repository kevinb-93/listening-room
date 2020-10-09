import React from 'react';
import { StyledMain } from '../styles/main';

const Main: React.FC = ({ children }) => {
    return <StyledMain>{children}</StyledMain>;
};

export default Main;
