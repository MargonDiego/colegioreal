'use client';

import { Container, Typography, Box, Link as MuiLink, useTheme, alpha } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedResource from '@/components/auth/ProtectedResource';

export default function StudentsLayout({ children }) {
    const pathname = usePathname();
    const theme = useTheme();

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 3, borderBottom: `2px solid ${theme.palette.divider}` }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Gestión de Estudiantes
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        mt: 2,
                        '& a': {
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
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
                            color: pathname === '/students' ? theme.palette.primary.main : theme.palette.text.primary,
                            fontWeight: pathname === '/students' ? 'bold' : 'normal',
                            borderBottom: pathname === '/students' ? `2px solid ${theme.palette.primary.main}` : 'none',
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
                                    : theme.palette.text.primary,
                                fontWeight: pathname.startsWith('/students/register') ? 'bold' : 'normal',
                                borderBottom: pathname.startsWith('/students/register')
                                    ? `2px solid ${theme.palette.primary.main}`
                                    : 'none',
                            }}
                        >
                            Registrar Estudiante
                        </MuiLink>
                    </ProtectedResource>

                    <MuiLink
                        component={Link}
                        href="/students/reports"
                        sx={{
                            color: pathname === '/students/reports' ? theme.palette.primary.main : theme.palette.text.primary,
                            fontWeight: pathname === '/students/reports' ? 'bold' : 'normal',
                            borderBottom: pathname === '/students/reports' ? `2px solid ${theme.palette.primary.main}` : 'none',
                        }}
                    >
                        Reportes
                    </MuiLink>
                </Box>
            </Box>
            <Box sx={{ mt: 3 }}>{children}</Box>
        </Container>
    );
}
