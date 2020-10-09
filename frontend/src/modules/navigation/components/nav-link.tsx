import React from 'react';
import { match } from 'react-router-dom';
import * as H from 'history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import {
    StyledNavLink,
    StyledNavLinkContent,
    StyledNavLinkLabel,
} from '../styles';

interface Props {
    to: string;
    icon?: IconProp;
    activePaths?: string[];
    label: string;
}

const NavLink: React.FC<Props> = ({ to, icon, label, activePaths }) => {
    const isActive = (match: match, location: H.Location) => {
        if (!activePaths) {
            return match ? true : false;
        }
        return activePaths.some((path) => location.pathname === path);
    };

    return (
        <StyledNavLink to={to} isActive={isActive} activeClassName={'active'}>
            <StyledNavLinkContent>
                {icon && <FontAwesomeIcon icon={icon} />}
                <StyledNavLinkLabel>{label}</StyledNavLinkLabel>
            </StyledNavLinkContent>
        </StyledNavLink>
    );
};

NavLink.defaultProps = {
    activePaths: null,
    icon: null,
};

export default NavLink;
