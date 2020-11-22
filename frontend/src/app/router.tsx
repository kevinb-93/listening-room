import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Settings from '../modules/settings/pages/settings';
import Queue from '../modules/queue/container/queue';
import Drawer from '../modules/drawer/components';
import Header from '../modules/shared/components/header';
import NavLink from '../modules/navigation/components/nav-link';
import GlobalStyle from '../modules/shared/styles/global';
import Main from '../modules/shared/components/main';
import Login from '../modules/party/containers/login';
import { useIdentityContext } from '../modules/shared/contexts/identity';
import PrivateRoute from '../modules/navigation/components/private-route';
import NavMenu from '../modules/navigation/components/nav-menu';
import { usePartyContext } from '../modules/party/context';

const Router: React.FC = () => {
    const { isLoggedIn, logout, isRestoring } = useIdentityContext();
    const { activeParty } = usePartyContext();

    if (isRestoring) {
        return <div>Restoring Token</div>;
    }

    return (
        <BrowserRouter>
            <GlobalStyle />
            {isLoggedIn() && (
                <>
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
                            <div id="partyId">{activeParty}</div>
                        </NavMenu>
                        <button onClick={() => logout()}>Log out</button>
                    </Header>
                    {/* <Drawer>
                        <SideNav>
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
                        </SideNav>
                    </Drawer> */}
                </>
            )}
            <Main>
                <Switch>
                    <PrivateRoute path="/settings">
                        <Settings />
                    </PrivateRoute>
                    <Route path="/auth">
                        {isLoggedIn() ? <Redirect to={'/queue'} /> : <Login />}
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
