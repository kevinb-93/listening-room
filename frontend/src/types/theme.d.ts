import 'styled-components';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

declare module 'styled-components' {
    interface DefaultTheme extends Theme {
        header?: {
            height: string;
        };
        drawer?: {
            width: string;
        };
    }
}

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        header?: {
            height: string;
        };
        drawer?: {
            width: string;
        };
    }
    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        header?: {
            height: string;
        };
        drawer?: {
            width: string;
        };
    }
}
