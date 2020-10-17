import * as React from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect,
    RouteProps,
} from 'react-router-dom';

import Settings from '../modules/settings/pages/settings';
import Queue from '../modules/queue/pages/queue';
import Search from '../modules/search/components';
import Drawer from '../modules/drawer/components';
import Header from '../modules/shared/components/header';
import SideNav from '../modules/navigation/components/side-nav';
import NavLink from '../modules/navigation/components/nav-link';
import GlobalStyle from '../modules/shared/styles/global';
import Main from '../modules/shared/components/main';
import Login from '../modules/user/pages/login';
import { useIdentityContext } from '../modules/user/context/identity';

const Router: React.FC = () => {
    const { loggedIn } = useIdentityContext();

    // A wrapper for <Route> that redirects to the login
    // screen if you're not yet authenticated.
    const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
        return (
            <Route
                {...rest}
                render={({ location }) =>
                    loggedIn ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: location },
                            }}
                        />
                    )
                }
            />
        );
    };

    return (
        <BrowserRouter>
            <GlobalStyle />
            {loggedIn && (
                <>
                    <Header>
                        <Search />
                    </Header>
                    <Drawer>
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
                    </Drawer>
                </>
            )}

            <Main>
                <Switch>
                    <PrivateRoute path="/settings">
                        <Settings />
                    </PrivateRoute>
                    <Route path="/login">
                        {loggedIn ? <Redirect to={'/queue'} /> : <Login />}
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
