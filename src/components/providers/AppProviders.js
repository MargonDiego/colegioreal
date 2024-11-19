// components/providers/AppProviders.js
'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { Fab, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { lightTheme, darkTheme } from '@/theme/theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';

export default function AppProviders({ children }) {
    const [queryClient] = useState(() => new QueryClient());
    const [darkMode, setDarkMode] = useState(false);
    const theme = useTheme();

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <QueryClientProvider client={queryClient}>
                    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                        <Fab
                            color="primary"
                            onClick={toggleTheme}
                            sx={{
                                position: 'fixed',
                                bottom: 16,
                                right: 16,
                                zIndex: theme.zIndex.drawer + 1,
                            }}
                        >
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </Fab>
                        {children}
                    </SnackbarProvider>
                </QueryClientProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}