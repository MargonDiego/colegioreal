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
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}
        >
            {/* Header de la sección */}
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '12px',
                    p: 3,
                    boxShadow: theme.shadows[1],
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                        mb: 3
                    }}
                >
                    Gestión de Estudiantes
                </Typography>

                {/* Navegación */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        '& a': {
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: theme.shape.borderRadius,
                            transition: 'all 0.2s ease',
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                color: theme.palette.primary.main,
                            },
                            '&[data-active="true"]': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                color: theme.palette.primary.main,
                                fontWeight: 'medium',
                            }
                        }
                    }}
                >
                    <Link 
                        href="/students" 
                        data-active={pathname === '/students'}
                        passHref
                    >
                        <MuiLink component="span">Lista de Estudiantes</MuiLink>
                    </Link>
                    <Link 
                        href="/students/new" 
                        data-active={pathname === '/students/new'}
                        passHref
                    >
                        <MuiLink component="span">Nuevo Estudiante</MuiLink>
                    </Link>
                </Box>
            </Box>

            {/* Contenido principal */}
            <Box
                sx={{
                    flex: 1,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '12px',
                    overflow: 'auto',
                    boxShadow: theme.shadows[1],
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
