import * as React from 'react';
import { AppContextProvider } from '../contexts/app';
import { ThemeProvider } from 'styled-components';
import { theme } from '../modules/shared/styles/theme';
import { IdentityContextProvider } from '../modules/user/context/identity';

export const Providers: React.FC = ({ children }) => {
    return (
        <IdentityContextProvider>
            <AppContextProvider>
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AppContextProvider>
        </IdentityContextProvider>
    );
};
