import * as React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSearch,
    faListOl,
    faCog,
    faTimes,
    faPlus,
    faPlay,
    faPause
} from '@fortawesome/free-solid-svg-icons';
import 'fontsource-roboto/300.css';
import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';
import 'fontsource-roboto/700.css';
import {} from '@material-ui/icons';

import { Providers } from './providers';
import Router from './router';

library.add(faSearch, faListOl, faCog, faTimes, faPlus, faPlay, faPause);

const App = () => {
    return (
        <Providers>
            <Router />
        </Providers>
    );
};

const container = document.querySelector('#root');

ReactDOM.render(<App />, container);
