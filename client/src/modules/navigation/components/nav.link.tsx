import React from 'react';
import { match, NavLink } from 'react-router-dom';
import * as H from 'history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styled from 'styled-components';

interface Props {
    to: string;
    icon?: IconProp;
    activePaths?: string[];
    label: string;
}

const NavigationLink: React.FC<Props> = ({ to, icon, label, activePaths }) => {
    const isActive = (match: match, location: H.Location) => {
        if (!activePaths) {
            return match ? true : false;
        }
        return activePaths.some(path => location.pathname === path);
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

const StyledNavLink = styled(NavLink).attrs(props => {
    props.activeClassName;
})`
    color: lightgray;

    &.${props => props.activeClassName} {
        color: green;
    }
`;

const StyledNavLinkContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0px;
`;

const StyledNavLinkLabel = styled.span`
    padding: 5px 0px;
`;

NavigationLink.defaultProps = {
    activePaths: undefined,
    icon: undefined
};

export default NavigationLink;
