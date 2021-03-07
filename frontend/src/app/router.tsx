import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Settings from '../modules/settings/pages/settings';
import Queue from '../modules/queue/container/queue';
import Header from '../modules/shared/components/header';
import NavLink from '../modules/navigation/components/nav-link';
import GlobalStyle from '../modules/shared/styles/global';
import Main from '../modules/shared/components/main';
import { useUserIdentityContext } from '../modules/user/contexts/identity';
import PrivateRoute from '../modules/navigation/components/private-route';
import NavMenu from '../modules/navigation/components/nav-menu';
import useAppIdentity from '../modules/shared/hooks/use-identity';
import { useUserProfileContext } from '../modules/user/contexts/profile';
import PartyAuth from '../modules/party/containers/party.auth';

const Router: React.FC = () => {
    const { isRestoring } = useUserIdentityContext();
    const { isLoggedIn, logout } = useAppIdentity();
    const { user } = useUserProfileContext();

    if (isRestoring) {
        return <div>Restoring Token</div>;
    }

    return (
        <BrowserRouter>
            <GlobalStyle />
            {isLoggedIn && (
                <Header>
                    <NavMenu>
                        <NavLink
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
                        <div id="partyId">{user?.party}</div>
                    </NavMenu>
                    <button onClick={() => logout()}>Log out</button>
                </Header>
            )}
            <Main>
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
            </Main>
        </BrowserRouter>
    );
};

export default Router;
