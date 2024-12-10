// src/app/(dashboard)/layout.js
'use client';

import { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 65;

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    return (
        <ProtectedRoute>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gridTemplateRows: 'auto 1fr auto',
                    minHeight: '100vh',
                    width: '100%',
                    gridTemplateAreas: `
                        "header header"
                        "sidebar main"
                        "footer footer"
                    `
                }}
            >
                {/* Header */}
                <Box sx={{ gridArea: 'header' }}>
                    <DashboardHeader />
                </Box>

                {/* Sidebar */}
                <Box sx={{ gridArea: 'sidebar' }}>
                    <DashboardSidebar
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        variant={isMobile ? 'temporary' : 'permanent'}
                    />
                </Box>

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        gridArea: 'main',
                        p: { xs: 2, sm: 3 },
                        backgroundColor: theme.palette.background.default,
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >
                    {children}
                </Box>

                {/* Footer */}
                <Box sx={{ gridArea: 'footer' }}>
                    <DashboardFooter />
                </Box>
            </Box>
        </ProtectedRoute>
    );
}
