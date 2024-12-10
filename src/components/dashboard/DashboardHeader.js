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
    useTheme,
    ListItemIcon,
    Divider,
    Chip,
} from '@mui/material';
import {
    AccountCircle,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    School as SchoolIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/hooks/useAuth';
import { useSnackbar } from 'notistack';

export default function DashboardHeader() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('es-CL', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            }));
        };
        
        updateTime();
        const interval = setInterval(updateTime, 1000);
        
        return () => clearInterval(interval);
    }, []);

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
                backgroundColor: 'primary.main',
                borderRadius: '0 0 12px 12px',
                boxShadow: (theme) => `0 2px 10px ${theme.palette.primary.dark}`,
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    px: 2,
                    minHeight: '70px'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SchoolIcon sx={{ fontSize: 32 }} />
                    <Typography variant="h6" noWrap component="div">
                        Colegio Real
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {/* Time Display */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon />
                        <Typography variant="body1">{currentTime}</Typography>
                    </Box>

                    {/* User Info and Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ textAlign: 'right', mr: 1 }}>
                            <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography variant="caption" color="inherit">
                                {user?.role}
                            </Typography>
                        </Box>

                        <Tooltip title="Configuración de cuenta">
                            <IconButton
                                size="large"
                                onClick={handleMenu}
                                color="inherit"
                                sx={{
                                    '&:hover': { 
                                        backgroundColor: theme.palette.action.hover 
                                    }
                                }}
                            >
                                <Avatar 
                                    sx={{ 
                                        width: 35, 
                                        height: 35,
                                        backgroundColor: theme.palette.secondary.main
                                    }}
                                >
                                    <AccountCircle />
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => {
                                handleClose();
                                router.push('/profile');
                            }}>
                                <ListItemIcon>
                                    <PersonIcon fontSize="small" />
                                </ListItemIcon>
                                Perfil
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleClose();
                                router.push('/settings');
                            }}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                Configuración
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Cerrar Sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
