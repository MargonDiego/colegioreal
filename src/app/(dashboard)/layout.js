// src/app/(dashboard)/layout.js
'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const DRAWER_WIDTH = 280;

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Ajuste automático del estado del sidebar en dispositivos móviles
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <ProtectedRoute>
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Grid container>
                    {/* Header */}
                    <Grid item xs={12}>
                        <DashboardHeader onSidebarToggle={handleSidebarToggle} />
                    </Grid>
                    {/* Sidebar y Contenido */}
                    <Grid item xs={2}>
                        <DashboardSidebar
                            open={sidebarOpen}
                            onClose={() => setSidebarOpen(false)}
                            variant={isMobile ? 'temporary' : 'permanent'}
                            sx={{ mt: 2 }} // Margen superior para evitar superposición
                        />
                    </Grid>
                    <Grid item xs={10}>
                        {/* Main Content */}
                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                p: 3,
                                mt: 2, // Margen superior para evitar que el contenido esté cubierto por el header
                                transition: theme.transitions.create(['margin', 'padding'], {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.leavingScreen,
                                }),
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            {children}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ProtectedRoute>
    );
}
