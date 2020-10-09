import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Settings from '../modules/settings/pages/settings';
import Queue from '../modules/queue/pages/queue';
import Search from '../modules/search/components';
import Drawer from '../modules/drawer/components';
import Header from '../modules/shared/components/header';
import SideNav from '../modules/navigation/components/side-nav';
import NavLink from '../modules/navigation/components/nav-link';
import GlobalStyle from '../modules/shared/styles/global';
import Main from '../modules/shared/components/main';

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <GlobalStyle />
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
                    <NavLink to="/settings" label={'Settings'} icon={'cog'} />
                </SideNav>
            </Drawer>
            <Main>
                <Switch>
                    <Route path="/settings">
                        <Settings />
                    </Route>
                    {/* Fallback */}
                    <Route path="/">
                        <Queue />
                    </Route>
                </Switch>
            </Main>
        </BrowserRouter>
    );
};

export default Router;
