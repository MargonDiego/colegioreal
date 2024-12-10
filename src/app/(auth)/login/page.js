'use client'

import { Box, Container, Paper, Typography, Grid, useTheme, useMediaQuery, Divider, Chip } from '@mui/material'
import LoginForm from '@/components/auth/LoginForm'
import { 
    School, 
    Email, 
    Phone, 
    LocationOn, 
    Facebook, 
    Instagram, 
    Twitter,
    AccessTime,
    EmojiEvents,
    MenuBook,
    Groups,
    CheckCircleOutline
} from '@mui/icons-material'

export default function LoginPage() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const stats = [
        { icon: <Groups />, label: 'Estudiantes', value: '1,200+' },
        { icon: <MenuBook />, label: 'Programas', value: '15+' },
        { icon: <EmojiEvents />, label: 'Premios', value: '50+' },
    ]

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                backgroundColor: theme.palette.grey[100],
                backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)',
                backgroundSize: '20px 20px'
            }}
        >
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Paper
                    elevation={6}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        overflow: 'hidden',
                        minHeight: { md: '600px' },
                        position: 'relative'
                    }}
                >
                    {/* Sección de información del colegio */}
                    <Box
                        sx={{
                            flex: { md: '1 0 50%' },
                            bgcolor: 'primary.main',
                            color: 'white',
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
                                backgroundSize: '10px 10px',
                                opacity: 0.3
                            }
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '120px',
                                height: '120px',
                                margin: '0 auto 2rem',
                                animation: 'pulse 2s infinite'
                            }}
                        >
                            <School sx={{ 
                                fontSize: '120px',
                                filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))'
                            }} />
                        </Box>

                        <Typography 
                            variant="h4" 
                            component="h1" 
                            align="center" 
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            Colegio Real
                        </Typography>

                        <Typography 
                            variant="h6" 
                            align="center" 
                            sx={{ 
                                mb: 4,
                                opacity: 0.9
                            }}
                        >
                            Sistema de Gestión Educativa
                        </Typography>

                        {/* Estadísticas */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-around',
                                mb: 4,
                                flexWrap: 'wrap',
                                gap: 2
                            }}
                        >
                            {stats.map((stat, index) => (
                                <Box 
                                    key={index}
                                    sx={{ 
                                        textAlign: 'center',
                                        flex: '1 1 auto',
                                        minWidth: '120px',
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        borderRadius: 1,
                                        backdropFilter: 'blur(5px)'
                                    }}
                                >
                                    {stat.icon}
                                    <Typography variant="h6" sx={{ mt: 1 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

                        {/* Información de contacto */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOn sx={{ mr: 1 }} /> Av. Principal 1234, Santiago
                            </Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Phone sx={{ mr: 1 }} /> +56 2 2345 6789
                            </Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Email sx={{ mr: 1 }} /> contacto@colegioreal.cl
                            </Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AccessTime sx={{ mr: 1 }} /> Lunes a Viernes: 8:00 - 17:00
                            </Typography>
                        </Box>

                        {/* Redes sociales */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                gap: 2,
                                mt: 3 
                            }}
                        >
                            {[Facebook, Instagram, Twitter].map((Icon, index) => (
                                <Icon 
                                    key={index}
                                    sx={{ 
                                        fontSize: 30,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.2)'
                                        }
                                    }} 
                                />
                            ))}
                        </Box>

                        <Typography 
                            variant="body2" 
                            align="center" 
                            sx={{ 
                                mt: 'auto',
                                pt: 4,
                                opacity: 0.8,
                                fontStyle: 'italic'
                            }}
                        >
                            "Formando líderes del mañana con excelencia y valores"
                        </Typography>
                    </Box>

                    {/* Sección de login */}
                    <Box
                        sx={{
                            flex: { md: '1 0 50%' },
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            position: 'relative',
                            bgcolor: '#fff'
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            component="h2" 
                            align="center" 
                            gutterBottom
                            color="primary"
                            sx={{ 
                                mb: 4,
                                fontWeight: 'bold'
                            }}
                        >
                            Iniciar Sesión
                        </Typography>

                        <LoginForm />

                        {/* Características destacadas */}
                        <Box sx={{ mt: 4 }}>
                            <Divider>
                                <Chip label="Características Destacadas" color="primary" />
                            </Divider>
                            <Box sx={{ mt: 2 }}>
                                {[
                                    'Acceso a notas y asistencia en tiempo real',
                                    'Comunicación directa con profesores',
                                    'Calendario de eventos y actividades',
                                    'Recursos educativos digitales'
                                ].map((feature, index) => (
                                    <Typography 
                                        key={index}
                                        variant="body2" 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            mb: 1,
                                            color: 'text.secondary'
                                        }}
                                    >
                                        <CheckCircleOutline 
                                            sx={{ 
                                                mr: 1, 
                                                fontSize: 20,
                                                color: 'success.main'
                                            }} 
                                        />
                                        {feature}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            {/* Animación keyframes */}
            <style jsx global>{`
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </Box>
    )
}