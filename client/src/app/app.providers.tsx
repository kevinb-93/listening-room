import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';

import { theme } from '../modules/shared/styles/theme';
import { UserIdentityContextProvider } from '../modules/user/contexts/identity';
import { SpotifyIdentityContextProvider } from '../modules/spotify/context/identity';
import { SpotifyContextProvider } from '../modules/spotify/context/spotify';
import SpotifyPlayerProvider from '../modules/spotify/context/player/provider';
import { UserProfileContextProvider } from '../modules/user/contexts/profile';
import { WebSocketContextProvider } from '../modules/shared/contexts/websocket';
import { CssBaseline } from '@material-ui/core';

export const Providers: React.FC = ({ children }) => {
    return (
        <CssBaseline>
            <StylesProvider injectFirst>
                <MuiThemeProvider theme={theme}>
                    <ThemeProvider theme={theme}>
                        <UserIdentityContextProvider>
                            <SpotifyIdentityContextProvider>
                                <UserProfileContextProvider>
                                    <WebSocketContextProvider>
                                        <SpotifyContextProvider>
                                            <SpotifyPlayerProvider>
                                                {children}
                                            </SpotifyPlayerProvider>
                                        </SpotifyContextProvider>
                                    </WebSocketContextProvider>
                                </UserProfileContextProvider>
                            </SpotifyIdentityContextProvider>
                        </UserIdentityContextProvider>
                    </ThemeProvider>
                </MuiThemeProvider>
            </StylesProvider>
        </CssBaseline>
    );
};
