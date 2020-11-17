import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';

import { AppContextProvider } from '../contexts/app';
import { theme } from '../modules/shared/styles/theme';
import { IdentityContextProvider } from '../modules/shared/contexts/identity';
import { SpotifyContextProvider } from '../modules/spotify/context/spotify';
import { SpotifyPlayerContextProvider } from '../modules/spotify/context/player';

export const Providers: React.FC = ({ children }) => {
    return (
        <StylesProvider injectFirst>
            <MuiThemeProvider theme={theme}>
                <ThemeProvider theme={theme}>
                    <IdentityContextProvider>
                        <AppContextProvider>
                            <SpotifyContextProvider>
                                <SpotifyPlayerContextProvider>
                                    {children}
                                </SpotifyPlayerContextProvider>
                            </SpotifyContextProvider>
                        </AppContextProvider>
                    </IdentityContextProvider>
                </ThemeProvider>
            </MuiThemeProvider>
        </StylesProvider>
    );
};
