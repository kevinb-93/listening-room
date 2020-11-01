import * as React from 'react';
import { AppContextProvider } from '../contexts/app';
import { ThemeProvider } from 'styled-components';
import { theme } from '../modules/shared/styles/theme';
import { IdentityContextProvider } from '../modules/shared/contexts/identity';
import { SpotifyContextProvider } from '../modules/spotify/context/spotify';
import { SpotifyPlayerContextProvider } from '../modules/spotify/context/player';

export const Providers: React.FC = ({ children }) => {
    return (
        <IdentityContextProvider>
            <AppContextProvider>
                <SpotifyContextProvider>
                    <SpotifyPlayerContextProvider>
                        <ThemeProvider theme={theme}>{children}</ThemeProvider>
                    </SpotifyPlayerContextProvider>
                </SpotifyContextProvider>
            </AppContextProvider>
        </IdentityContextProvider>
    );
};
