// src/theme/theme.js
'use client';
import { createTheme } from '@mui/material/styles';

const basePalette = {
    error: { main: '#FF3D00', contrastText: '#F5F5F5' },
    warning: { main: '#FFB300', contrastText: '#2A2A2E' },
    info: { main: '#00B0FF', contrastText: '#2A2A2E' },
    success: { main: '#4CAF50', contrastText: '#F5F5F5' },
};

const lightPalette = {
    ...basePalette,
    primary: { main: '#4A90E2', light: '#A4C8E1', dark: '#003D6B', contrastText: '#F5F5F5' },
    secondary: { main: '#D5006D', light: '#FF6F91', dark: '#9B003B', contrastText: '#F5F5F5' },
    background: { default: '#F0F4F8', paper: '#FFFFFF' },
    text: { primary: '#2A2A2E', secondary: '#4A4A4A' },
};

const darkPalette = {
    ...basePalette,
    primary: { main: '#1E88E5', light: '#6AB7FF', dark: '#0D47A1', contrastText: '#F5F5F5' },
    secondary: { main: '#D81B60', light: '#FF5C8D', dark: '#9B003B', contrastText: '#F5F5F5' },
    background: { default: '#121212', paper: '#1E1E1E' },
    text: { primary: '#E0E0E0', secondary: '#B0B0B0' },
};

const commonComponents = {
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                transition: 'all 0.3s ease',
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: '16px',
                padding: '20px',
                // Cambiar a un color sólido para evitar la transparencia
                backgroundColor: '#FFFFFF',
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF', // Fondo blanco para los campos de texto
                    '& fieldset': {
                        borderColor: '#CCCCCC', // Color del borde
                    },
                    '&:hover fieldset': {
                        borderColor: '#4A90E2', // Color del borde en hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#4A90E2', // Color del borde cuando está enfocado
                    },
                },
            },
        },
    },
    MuiMenu: {
        styleOverrides: {
            paper: {
                backgroundColor: '#FFFFFF', // Fondo blanco para el menú desplegable
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombra para mejor visibilidad
                borderRadius: '8px', // Borde redondeado para el menú
            },
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: {
                '&:hover': {
                    backgroundColor: '#F0F4F8', // Fondo en hover
                },
            },
        },
    },
};


const lightTheme = createTheme({
    palette: { mode: 'light', ...lightPalette },
    components: commonComponents,
});

const darkTheme = createTheme({
    palette: { mode: 'dark', ...darkPalette },
    components: commonComponents,
});

export { lightTheme, darkTheme };
