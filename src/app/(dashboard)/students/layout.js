'use client';

import { Typography, Box, Link as MuiLink, useTheme, alpha } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedResource from '@/components/auth/ProtectedResource';

export default function StudentsLayout({ children }) {
    const pathname = usePathname();
    const theme = useTheme();

    return (
        <Box
            sx={{
                flexGrow: 1,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                mt:8,
            }}
        >
            <Box
                sx={{
                    pb: 3,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: theme.palette.text.primary,
                    }}
                >
                    Gestión de Estudiantes
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 2,
                        '& a': {
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: theme.shape.borderRadius,
                            transition: 'all 0.3s ease',
                            fontWeight: 500,
                        },
                        '& a:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                    }}
                >
                    <MuiLink
                        component={Link}
                        href="/students"
                        sx={{
                            color: pathname === '/students' ? theme.palette.primary.main : theme.palette.text.secondary,
                            fontWeight: pathname === '/students' ? 'bold' : 'normal',
                            borderBottom: pathname === '/students' ? `3px solid ${theme.palette.primary.main}` : 'none',
                            '&:hover': {
                                color: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Listado de Estudiantes
                    </MuiLink>

                    <ProtectedResource entity="student" operation="CREATE">
                        <MuiLink
                            component={Link}
                            href="/students/register"
                            sx={{
                                color: pathname.startsWith('/students/register')
                                    ? theme.palette.primary.main
                                    : theme.palette.text.secondary,
                                fontWeight: pathname.startsWith('/students/register') ? 'bold' : 'normal',
                                borderBottom: pathname.startsWith('/students/register')
                                    ? `3px solid ${theme.palette.primary.main}`
                                    : 'none',
                                '&:hover': {
                                    color: theme.palette.primary.dark,
                                },
                            }}
                        >
                            Registrar Estudiante
                        </MuiLink>
                    </ProtectedResource>

                    <MuiLink
                        component={Link}
                        href="/students/reports"
                        sx={{
                            color: pathname === '/students/reports' ? theme.palette.primary.main : theme.palette.text.secondary,
                            fontWeight: pathname === '/students/reports' ? 'bold' : 'normal',
                            borderBottom: pathname === '/students/reports'
                                ? `3px solid ${theme.palette.primary.main}`
                                : 'none',
                            '&:hover': {
                                color: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Reportes
                    </MuiLink>
                </Box>
            </Box>
            <Box sx={{ mt: 3 }}>{children}</Box>
        </Box>
    );
}
