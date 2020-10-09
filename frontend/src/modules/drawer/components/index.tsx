import React from 'react';
import ReactDOM from 'react-dom';
import { useAppContext } from '../../../contexts/app';
import { StyledDrawer } from '../styles';

const Drawer: React.FC = ({ children }) => {
    const { isDrawerHidden } = useAppContext();

    const content = <StyledDrawer>{children}</StyledDrawer>;

    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default Drawer;
