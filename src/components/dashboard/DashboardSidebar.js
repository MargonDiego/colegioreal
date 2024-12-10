'use client';

import React from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    School as SchoolIcon,
    Psychology as PsychologyIcon,
    SupervisorAccount as SupervisorAccountIcon,
    Assessment as AssessmentIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';

const DRAWER_WIDTH = 280;

const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: DashboardIcon, permission: { entity: 'DASHBOARD', operation: 'READ' } },
    { title: 'Estudiantes', path: '/students', icon: SchoolIcon, permission: { entity: 'STUDENT', operation: 'READ' } },
    { title: 'Intervenciones', path: '/interventions', icon: PsychologyIcon, permission: { entity: 'INTERVENTION', operation: 'READ' } },
    { title: 'Usuarios', path: '/usuarios', icon: SupervisorAccountIcon, permission: { entity: 'USER', operation: 'READ' } },
    { title: 'Auditoría', path: '/auditoria', icon: AssessmentIcon, permission: { entity: 'AUDIT', operation: 'READ' } },
];

export default function DashboardSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const { checkEntity } = usePermissions();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(!isMobile);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.paper,
                boxShadow: isMobile ? theme.shadows[4] : 'none',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: theme.spacing(2),
                    mt: isMobile ? 2 : 10,
                }}
            >
                <Typography variant="h6" color="text.primary" noWrap sx={{ fontWeight: 'bold' }}>
                    Sistema de Gestión
                </Typography>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeftIcon />
                    </IconButton>
                )}
            </Box>
            <Divider sx={{ backgroundColor: theme.palette.divider }} />
            <List>
                {menuItems.map((item) => {
                    if (!checkEntity(item.permission.entity, item.permission.operation)) return null;

                    const IconComponent = item.icon;
                    const isSelected = pathname === item.path;

                    return (
                        <ListItemButton
                            key={item.path}
                            selected={isSelected}
                            onClick={() => {
                                router.push(item.path);
                                if (isMobile) setOpen(false);
                            }}
                            sx={{
                                backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                                transition: 'background-color 0.3s',
                                borderRadius: theme.spacing(1),
                                mx: theme.spacing(1),
                                my: theme.spacing(0.5),
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                                    minWidth: 40,
                                }}
                            >
                                <IconComponent />
                            </ListItemIcon>
                            <ListItemText
                                primary={item.title}
                                sx={{
                                    color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
            <Divider sx={{ backgroundColor: theme.palette.divider }} />
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    © 2024 Wachimingus
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ ml: 2 }}
                >
                    <MenuIcon />
                </IconButton>
            )}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={open}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        backgroundColor: theme.palette.background.default,
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
}
