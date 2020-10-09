import * as React from 'react';
import { AppContextProvider } from '../contexts/app';
import { ThemeProvider } from 'styled-components';
import { theme } from '../modules/shared/styles/theme';

export const Providers: React.FC = ({ children }) => {
    return (
        <AppContextProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppContextProvider>
    );
};
