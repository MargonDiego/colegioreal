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
    mode: 'light',
    primary: { main: '#4A90E2', light: '#A4C8E1', dark: '#003D6B', contrastText: '#F5F5F5' },
    secondary: { main: '#D5006D', light: '#FF6F91', dark: '#9B003B', contrastText: '#F5F5F5' },
    background: { 
        default: '#F0F4F8', 
        paper: '#FFFFFF',
        alternate: '#F5F7FA' 
    },
    text: { 
        primary: '#2A2A2E', 
        secondary: '#4A4A4A',
        disabled: '#9E9E9E' 
    },
    divider: 'rgba(0, 0, 0, 0.12)',
};

const darkPalette = {
    ...basePalette,
    mode: 'dark',
    primary: { main: '#1E88E5', light: '#6AB7FF', dark: '#0D47A1', contrastText: '#F5F5F5' },
    secondary: { main: '#D81B60', light: '#FF5C8D', dark: '#9B003B', contrastText: '#F5F5F5' },
    background: { 
        default: '#121212', 
        paper: '#1E1E1E',
        alternate: '#2A2A2E' 
    },
    text: { 
        primary: '#E0E0E0', 
        secondary: '#B0B0B0',
        disabled: '#6E6E6E' 
    },
    divider: 'rgba(255, 255, 255, 0.12)',
};

const getComponents = (palette) => ({
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: palette.background.paper,
            },
        },
    },
    MuiTable: {
        styleOverrides: {
            root: {
                backgroundColor: palette.background.paper,
                '& .MuiTableCell-root': {
                    borderBottom: `1px solid ${palette.divider}`,
                },
            },
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                padding: '12px 16px',
                fontSize: '0.875rem',
                color: palette.text.primary,
                '&.MuiTableCell-head': {
                    backgroundColor: palette.background.alternate,
                    fontWeight: 600,
                },
            },
        },
    },
    MuiTableRow: {
        styleOverrides: {
            root: {
                '&:nth-of-type(odd)': {
                    backgroundColor: palette.background.alternate,
                },
                '&:hover': {
                    backgroundColor: palette.action?.hover || 'rgba(0, 0, 0, 0.04)',
                },
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: palette.divider,
                    },
                    '&:hover fieldset': {
                        borderColor: palette.primary.main,
                    },
                },
            },
        },
    },
});

export const lightTheme = createTheme({
    palette: lightPalette,
    components: getComponents(lightPalette),
});

export const darkTheme = createTheme({
    palette: darkPalette,
    components: getComponents(darkPalette),
});
