import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const StyledSideNav = styled.div`
    display: flex;
    flex-direction: column;
`;

export const StyledNavLink = styled(NavLink).attrs((props) => {
    props.activeClassName;
})`
    color: lightgray;

    &.${(props) => props.activeClassName} {
        color: green;
    }
`;

export const StyledNavLinkContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0px;
`;

export const StyledNavLinkLabel = styled.span`
    padding: 5px 0px;
`;
