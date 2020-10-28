import * as React from 'react';
import { AppContextProvider } from '../contexts/app';
import { ThemeProvider } from 'styled-components';
import { theme } from '../modules/shared/styles/theme';
import { IdentityContextProvider } from '../modules/shared/contexts/identity';
import { SpotifyContextProvider } from '../modules/spotify/context/spotify';

export const Providers: React.FC = ({ children }) => {
    return (
        <IdentityContextProvider>
            <AppContextProvider>
                <SpotifyContextProvider>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </SpotifyContextProvider>
            </AppContextProvider>
        </IdentityContextProvider>
    );
};
