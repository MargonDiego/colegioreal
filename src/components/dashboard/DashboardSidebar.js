'use client';

import React from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    Tooltip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    School as SchoolIcon,
    Psychology as PsychologyIcon,
    SupervisorAccount as SupervisorAccountIcon,
    Assessment as AssessmentIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 65;

const menuItems = [
    { 
        title: 'Dashboard', 
        path: '/dashboard', 
        icon: DashboardIcon, 
        permission: { entity: 'DASHBOARD', operation: 'READ' },
        description: 'Panel principal con estadísticas y resumen'
    },
    { 
        title: 'Estudiantes', 
        path: '/students', 
        icon: SchoolIcon, 
        permission: { entity: 'STUDENT', operation: 'READ' },
        description: 'Gestión de estudiantes y sus datos'
    },
    { 
        title: 'Intervenciones', 
        path: '/interventions', 
        icon: PsychologyIcon, 
        permission: { entity: 'INTERVENTION', operation: 'READ' },
        description: 'Registro y seguimiento de intervenciones'
    },
    { 
        title: 'Usuarios', 
        path: '/usuarios', 
        icon: SupervisorAccountIcon, 
        permission: { entity: 'USER', operation: 'READ' },
        description: 'Administración de usuarios del sistema'
    },
];

export default function DashboardSidebar({ variant = 'permanent', open, onClose }) {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const { checkEntity } = usePermissions();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isExpanded, setIsExpanded] = React.useState(true);

    const handleDrawerToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.palette.background.paper,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Logo y Título */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon 
                        sx={{ 
                            fontSize: 28,
                            color: theme.palette.primary.main 
                        }} 
                    />
                    {isExpanded && (
                        <Typography variant="subtitle1" noWrap>
                            Colegio Real
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Lista de Menú */}
            <List 
                sx={{ 
                    flexGrow: 1,
                    pt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {menuItems.map((item) => {
                    if (!checkEntity(item.permission.entity, item.permission.operation)) return null;

                    const isSelected = pathname === item.path;
                    const IconComponent = item.icon;

                    return (
                        <Tooltip 
                            key={item.path}
                            title={!isExpanded ? `${item.title} - ${item.description}` : ""}
                            placement="right"
                            arrow
                        >
                            <ListItemButton
                                onClick={() => router.push(item.path)}
                                sx={{
                                    minHeight: 48,
                                    width: isExpanded ? '85%' : '80%',
                                    justifyContent: isExpanded ? 'flex-start' : 'center',
                                    px: isExpanded ? 3 : 2,
                                    borderRadius: '10px',
                                    ...(isSelected && {
                                        bgcolor: `${theme.palette.primary.main}15`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.primary.main}25`,
                                        },
                                    }),
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: isExpanded ? 2 : 'auto',
                                        justifyContent: 'center',
                                        color: isSelected ? theme.palette.primary.main : 'inherit',
                                    }}
                                >
                                    <IconComponent />
                                </ListItemIcon>
                                {isExpanded && (
                                    <ListItemText 
                                        primary={item.title}
                                        secondary={item.description}
                                        primaryTypographyProps={{
                                            color: isSelected ? 'primary' : 'inherit',
                                            fontWeight: isSelected ? 'bold' : 'normal',
                                            fontSize: '0.9rem',
                                        }}
                                        secondaryTypographyProps={{
                                            variant: 'caption',
                                            sx: { 
                                                display: 'block', 
                                                mt: 0.5,
                                                color: theme.palette.text.secondary,
                                                fontSize: '0.75rem',
                                                lineHeight: '1.2'
                                            }
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    );
                })}
            </List>

            {/* Footer */}
            {isExpanded && (
                <Box
                    sx={{
                        p: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Colegio Real {new Date().getFullYear()}
                    </Typography>
                </Box>
            )}
        </Box>
    );

    // Constantes para las transiciones
    const TRANSITION_DURATION = 250;
    const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

    return (
        <Box sx={{ position: 'relative', display: 'flex' }}>
            <Drawer
                variant={variant}
                open={variant === 'temporary' ? open : true}
                onClose={onClose}
                sx={{
                    width: isExpanded ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isExpanded ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
                        boxSizing: 'border-box',
                        borderRight: `1px solid ${theme.palette.divider}`,
                        transition: `width ${TRANSITION_DURATION}ms ${TRANSITION_EASING}`,
                        '& .MuiListItemText-root': {
                            opacity: isExpanded ? 1 : 0,
                            transition: `opacity ${TRANSITION_DURATION}ms ${TRANSITION_EASING}`,
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: isExpanded ? 40 : 0,
                            transition: `min-width ${TRANSITION_DURATION}ms ${TRANSITION_EASING}`,
                        },
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Botón de expansión fuera del Drawer */}
            <IconButton 
                onClick={handleDrawerToggle}
                sx={{
                    position: 'fixed', 
                    left: isExpanded ? DRAWER_WIDTH - 15 : DRAWER_WIDTH_COLLAPSED - 15,
                    top: '50vh', 
                    transform: 'translateY(-50%)',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderLeft: 'none',
                    borderRadius: '0 8px 8px 0',
                    '&:hover': {
                        bgcolor: theme.palette.action.hover,
                    },
                    width: 30,
                    height: 30,
                    zIndex: theme.zIndex.drawer + 1,
                    boxShadow: theme.shadows[2],
                    transition: `
                        left ${TRANSITION_DURATION}ms ${TRANSITION_EASING},
                        transform ${TRANSITION_DURATION}ms ${TRANSITION_EASING},
                        background-color 150ms ${TRANSITION_EASING}
                    `,
                    '& .MuiSvgIcon-root': {
                        transition: `transform ${TRANSITION_DURATION}ms ${TRANSITION_EASING}`,
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                    }
                }}
            >
                {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
        </Box>
    );
}
