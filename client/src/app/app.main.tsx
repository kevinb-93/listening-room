import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Settings from '../modules/settings/pages/settings';
import Queue from '../modules/queue/container/queue';
import NavBar from '../modules/navigation/components/nav.bar';
import GlobalStyle from '../modules/shared/styles/global';
import { useUserIdentityContext } from '../modules/user/contexts/identity';
import PrivateRoute from '../modules/navigation/components/nav.private-route';
import NavMenu from '../modules/navigation/components/nav.menu';
import useAppIdentity from '../modules/shared/hooks/use-identity';
import { useUserProfileContext } from '../modules/user/contexts/profile';
import UserLogin from '../modules/user/containers/user.login';
import SpotifySearch from '../modules/spotify/containers/spotify.search-tracks';
import { useWebSocketContext } from '../modules/shared/contexts/websocket';
import { io } from 'socket.io-client';
import { WebSocketReducerActionType } from '../modules/shared/contexts/websocket/reducer/types';
import { baseUrl } from '../modules/shared/config/api';
import UserRegister from '../modules/user/containers/user.register';

const Main: React.FC = () => {
    const { isRestoring } = useUserIdentityContext();
    const { isLoggedIn } = useAppIdentity();
    const { user } = useUserProfileContext();
    const { socket, dispatch } = useWebSocketContext();

    useEffect(
        function connectPartyUserWebsocketEffect() {
            if (!socket) return;
            if (!user.party) return;

            const roomId = user.party;

            socket.emit('join', roomId);
        },
        [socket, user.party]
    );

    useEffect(
        function disconnectWebSocketEffect() {
            if (!isLoggedIn && !socket?.disconnected) socket?.disconnect();
        },
        [isLoggedIn, socket]
    );

    useEffect(
        function connectWebSocketEffect() {
            if (!isLoggedIn || socket) return;

            const socketIo = io(baseUrl);
            dispatch({
                type: WebSocketReducerActionType.setSocket,
                payload: { socket: socketIo }
            });
        },
        [dispatch, isLoggedIn, socket]
    );

    if (isRestoring) {
        return <div>Restoring Token</div>;
    }

    return (
        <BrowserRouter>
            <GlobalStyle />
            {isLoggedIn && (
                <StyledNavBar>
                    <NavMenu>
                        <SpotifySearch />
                    </NavMenu>
                </StyledNavBar>
            )}
            <Switch>
                <PrivateRoute path="/settings">
                    <Settings />
                </PrivateRoute>
                <Route path="/register">
                    {isLoggedIn ? <Redirect to={'/'} /> : <UserRegister />}
                </Route>
                <Route path="/login">
                    {isLoggedIn ? <Redirect to={'/'} /> : <UserLogin />}
                </Route>
                <PrivateRoute path="/">
                    <Queue />
                </PrivateRoute>
            </Switch>
        </BrowserRouter>
    );
};

const StyledNavBar = styled(NavBar)`
    grid-area: header;
`;

export default Main;
