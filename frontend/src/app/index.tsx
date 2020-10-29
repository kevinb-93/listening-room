import * as React from 'react';
import ReactDOM from 'react-dom';
import { debugContextDevtool } from 'react-context-devtool';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSearch,
    faListOl,
    faCog,
    faTimes,
    faPlus,
    faPlay,
} from '@fortawesome/free-solid-svg-icons';

import { Providers } from './providers';
import Router from './router';

/* Add font-awesome icons for global use */
library.add(faSearch, faListOl, faCog, faTimes, faPlus, faPlay);

const App = () => {
    return (
        <Providers>
            <Router />
        </Providers>
    );
};

const container = document.querySelector('#root');

ReactDOM.render(<App />, container);

// Attach root container
// debugContextDevtool(container);
