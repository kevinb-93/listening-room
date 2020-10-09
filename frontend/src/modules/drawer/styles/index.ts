import styled from 'styled-components';

export const StyledDrawer = styled.div`
    height: 100%; /* 100% Full-height */
    position: fixed; /* Stay in place */
    z-index: 1; /* Stay on top */
    width: ${(props) => props.theme.drawer.width};
    top: 0; /* Stay at the top */
    left: 0;
    margin-top: ${(props) => props.theme.header.height};
    /* background-image: linear-gradient(270deg, rgba(211, 211, 211, 0), rgba(211, 211, 211, 0.3)); */
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
`;
