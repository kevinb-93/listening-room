import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Settings from '../modules/settings/pages/settings';
import Queue from '../modules/queue/container/queue';
import NavBar from '../modules/navigation/components/nav.bar';
import NavLink from '../modules/navigation/components/nav.link';
import GlobalStyle from '../modules/shared/styles/global';
import { useUserIdentityContext } from '../modules/user/contexts/identity';
import PrivateRoute from '../modules/navigation/components/nav.private-route';
import NavMenu from '../modules/navigation/components/nav.menu';
import useAppIdentity from '../modules/shared/hooks/use-identity';
import { useUserProfileContext } from '../modules/user/contexts/profile';
import PartyAuth from '../modules/party/containers/party.auth';
import SpotifySearch from '../modules/spotify/containers/spotify.search-tracks';

const Main: React.FC = () => {
    const { isRestoring } = useUserIdentityContext();
    const { isLoggedIn } = useAppIdentity();

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
                        {/* <NavLink
                            to="/queue"
                            label={'Queue'}
                            icon={'list-ol'}
                            activePaths={['/', '/queue']}
                        />
                        <NavLink
                            to="/settings"
                            label={'Settings'}
                            icon={'cog'}
                        />
                        <div id="partyId">{user?.party}</div> */}
                    </NavMenu>
                </StyledNavBar>
            )}
            <StyledMain useHeaderHeight={isLoggedIn}>
                <Switch>
                    <PrivateRoute path="/settings">
                        <Settings />
                    </PrivateRoute>
                    <Route path="/auth">
                        {isLoggedIn ? (
                            <Redirect to={'/queue'} />
                        ) : (
                            <PartyAuth />
                        )}
                    </Route>
                    {/* Fallback */}
                    <PrivateRoute path="/">
                        <Queue />
                    </PrivateRoute>
                </Switch>
            </StyledMain>
        </BrowserRouter>
    );
};

interface StyledMain {
    useHeaderHeight: boolean;
}

const StyledNavBar = styled(NavBar)`
    grid-area: header;
`;

const StyledMain = styled.main<StyledMain>`
    grid-area: main;
`;

export default Main;
