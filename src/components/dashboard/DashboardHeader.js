// components/dashboard/DashboardHeader.js
'use client';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
    Box,
    Menu,
    MenuItem,
    Tooltip,
    Badge,
    useTheme,
    Paper,
    ListItemIcon,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Notifications,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/hooks/useAuth';
import { useSnackbar } from 'notistack';

export default function DashboardHeader({ onSidebarToggle }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            enqueueSnackbar('Error al cerrar sesión', { variant: 'error' });
        }
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: theme.shadows[4],
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton color="inherit" edge="start" onClick={onSidebarToggle} sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit">
                    Sistema de Intervenciones
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Notificaciones">
                        <IconButton color="inherit" sx={{ transition: 'all 0.3s' }}>
                            <Badge badgeContent={4} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cuenta">
                        <IconButton onClick={handleMenu} color="inherit" sx={{ transition: 'all 0.3s' }}>
                            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                                {user?.firstName?.charAt(0) || <AccountCircle />}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            elevation: 8,
                            sx: {
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                borderRadius: 2,
                                minWidth: 200,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease-in-out',
                                transformOrigin: 'top right',
                            },
                        }}
                    >
                        <MenuItem onClick={() => { handleClose(); router.push('/perfil'); }}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                            </ListItemIcon>
                            Mi Perfil
                        </MenuItem>
                        <MenuItem onClick={() => { handleClose(); router.push('/configuracion'); }}>
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                            </ListItemIcon>
                            Configuración
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                            </ListItemIcon>
                            Cerrar Sesión
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
