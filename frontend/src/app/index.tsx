import * as React from 'react';
import ReactDOM from 'react-dom';
import { Providers } from './providers';
import Router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSearch,
    faListOl,
    faCog,
    faTimes,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';

/* Add font-awesome icons for global use */
library.add(faSearch, faListOl, faCog, faTimes, faPlus);

const App = () => {
    return (
        <Providers>
            <Router />
        </Providers>
    );
};

ReactDOM.render(<App />, document.querySelector('#root'));
