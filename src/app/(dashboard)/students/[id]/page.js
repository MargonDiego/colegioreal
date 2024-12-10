'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Container, Paper, Typography, Avatar, Box, Chip, Button,
    Grid, Card, CardContent, Tabs, Tab, IconButton,
    LinearProgress, Divider, CircularProgress, Alert,
    List, ListItem, ListItemText, ListItemIcon, Fab,
    Table, TableBody, TableCell, TableRow
} from '@mui/material';
import {
    Person, School, People, Edit, ArrowBack,
    CalendarToday, Email, Badge, Flag, Class,
    AssignmentInd, School as SchoolIcon, LocalHospital,
    Home, HealthAndSafety, Psychology, AttachMoney, LocationCity
} from '@mui/icons-material';
import { useStudents } from '@/hooks/useStudents';
import { useInterventions } from '@/hooks/useInterventions';
import ProtectedResource from '@/components/auth/ProtectedResource';
import InterventionsList from '@/components/interventions/InterventionsList';
import SimpleInterventionsCalendar from '@/components/interventions/SimpleInterventionsCalendar';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>{children}</Box>
            )}
        </div>
    );
}

// Estilos personalizados para las tarjetas y contenedores
const styles = {
    mainContainer: {
        mt: 4,
        mb: 4,
        px: { xs: 2, sm: 3 }
    },
    headerSection: {
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        gap: 2
    },
    sideCard: {
        height: '100%',
        position: 'sticky',
        top: 20,
    },
    contentCard: {
        height: '100%',
        transition: 'all 0.3s ease'
    },
    tabPanel: {
        p: 3
    },
    jsonDisplay: {
        p: 2,
        bgcolor: '#f8f9fa',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        '& .json-content': {
            fontFamily: 'Consolas, monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: 0,
            padding: '12px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
        }
    },
    dataDisplay: {
        p: 2,
        bgcolor: 'background.default',
        borderRadius: 1,
        '& pre': {
            margin: 0,
            overflow: 'auto',
            maxHeight: '300px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
        }
    },
    jsonContainer: {
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        '& pre': {
            margin: 0,
            padding: '12px',
            fontFamily: 'Consolas, monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            overflow: 'auto'
        }
    }
};

// Función para formatear JSON con colores
const formatJSON = (data) => {
    try {
        // Asegurarse de que tenemos un objeto JavaScript
        const jsonObject = typeof data === 'string' ? JSON.parse(data) : data;
        
        // Convertir el objeto a string con formato
        const jsonString = JSON.stringify(jsonObject, null, 2);
        
        // Aplicar colores y formato
        return jsonString
            // Escapar caracteres HTML para seguridad
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Formatear el JSON
            .replace(/(".*?")(: )/g, '<span style="color: #2196f3;">$1</span>$2') // keys
            .replace(/: "(.+?)"/g, ': <span style="color: #4caf50;">"$1"</span>') // string values
            .replace(/: (\d+\.?\d*)/g, ': <span style="color: #ff9800;">$1</span>') // numbers
            .replace(/: (true|false)/g, ': <span style="color: #f44336;">$1</span>') // booleans
            .replace(/[{}\[\]]/g, match => `<span style="color: #666666; font-weight: bold;">${match}</span>`); // brackets
    } catch (error) {
        console.error('Error formatting JSON:', error);
        return JSON.stringify(data, null, 2); // Fallback a JSON simple si hay error
    }
};

export default function StudentDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [tabValue, setTabValue] = React.useState(0);
    const { data, isLoading, isError } = useStudents();
    const { data: interventionsData, isLoading: isLoadingInterventions } = useInterventions({
        filters: {
            studentId: parseInt(id)
        }
    });

    useEffect(() => {
        if (!isLoading && data?.data) {
            const studentsArray = Array.isArray(data.data) ? data.data : [];
            const studentData = studentsArray.find((item) => item.id === parseInt(id));
            if (studentData) {
                setStudent(studentData);
            }
        }
    }, [data, id, isLoading]);

    if (isLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );

    if (isError) return (
        <Alert severity="error">Error al cargar los datos del estudiante</Alert>
    );

    if (!student) return (
        <Alert severity="warning">Estudiante no encontrado</Alert>
    );

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg" sx={styles.mainContainer}>
            <Box sx={styles.headerSection}>
                <IconButton 
                    onClick={() => router.back()}
                    sx={{ 
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { bgcolor: 'background.default' }
                    }}
                >
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" component="h1" fontWeight="medium">
                    Detalle del Estudiante
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Tarjeta de información básica */}
                <Grid item xs={12} md={4}>
                    <Card sx={styles.sideCard} elevation={2}>
                        <CardContent>
                            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                                <Avatar
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mb: 2,
                                        bgcolor: 'primary.main',
                                        fontSize: '2.5rem',
                                        boxShadow: 2
                                    }}
                                >
                                    {student?.firstName?.[0]}{student?.lastName?.[0]}
                                </Avatar>
                                <Typography variant="h5" align="center" gutterBottom fontWeight="medium">
                                    {student?.firstName} {student?.lastName}
                                </Typography>
                                <Chip
                                    label={student?.enrollmentStatus}
                                    color={student?.enrollmentStatus === 'Regular' ? 'success' : 'warning'}
                                    sx={{ 
                                        mt: 1,
                                        fontWeight: 'medium',
                                        px: 1
                                    }}
                                />
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <Badge color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2">RUT</Typography>}
                                        secondary={student?.rut}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Email color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2">Email</Typography>}
                                        secondary={student?.email || 'No registrado'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarToday color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2">Fecha de Nacimiento</Typography>}
                                        secondary={student?.birthDate ? new Date(student.birthDate).toLocaleDateString() : 'No registrada'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Flag color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2">Nacionalidad</Typography>}
                                        secondary={student?.nationality || 'No registrada'}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Contenido principal */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }} elevation={2}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    minHeight: 64,
                                    textTransform: 'none',
                                }
                            }}
                        >
                            <Tab 
                                icon={<School />} 
                                label="Información Académica" 
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    alignItems: 'center'
                                }}
                            />
                            <Tab 
                                icon={<People />} 
                                label="Información Familiar"
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    alignItems: 'center'
                                }}
                            />
                            <Tab 
                                icon={<HealthAndSafety />} 
                                label="Salud"
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    alignItems: 'center'
                                }}
                            />
                            <Tab 
                                icon={<Psychology />} 
                                label="NEE"
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    alignItems: 'center'
                                }}
                            />
                            <Tab 
                                icon={<AttachMoney />} 
                                label="Socioeconómico"
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    alignItems: 'center'
                                }}
                            />
                            <Tab 
                                icon={<LocalHospital />} 
                                label="Intervenciones"
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    alignItems: 'center'
                                }}
                            />
                        </Tabs>

                        {/* Tab: Información Académica */}
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={styles.contentCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Datos Académicos Básicos
                                            </Typography>
                                            <List>
                                                <ListItem>
                                                    <ListItemIcon><Class color="primary" /></ListItemIcon>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Curso</Typography>}
                                                        secondary={`${student?.grade} ${student?.section || ''}`} 
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><CalendarToday color="primary" /></ListItemIcon>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Año Académico</Typography>}
                                                        secondary={student?.academicYear} 
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><AssignmentInd color="primary" /></ListItemIcon>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">N° Matrícula</Typography>}
                                                        secondary={student?.matriculaNumber} 
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Colegio Anterior</Typography>}
                                                        secondary={student?.previousSchool || 'No registrado'} 
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card sx={styles.contentCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Asistencia
                                            </Typography>
                                            {student?.attendance ? (
                                                <Box>
                                                    <Table size="small">
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell 
                                                                    component="th" 
                                                                    sx={{ 
                                                                        fontWeight: 'bold',
                                                                        color: 'primary.main',
                                                                        width: '50%'
                                                                    }}
                                                                >
                                                                    Total
                                                                </TableCell>
                                                                <TableCell>{student?.attendance.total}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell 
                                                                    component="th"
                                                                    sx={{ 
                                                                        fontWeight: 'bold',
                                                                        color: 'primary.main' 
                                                                    }}
                                                                >
                                                                    Asistidos
                                                                </TableCell>
                                                                <TableCell>{student?.attendance.attended}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            ) : (
                                                <Typography color="text.secondary">
                                                    No hay registros de asistencia
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {student?.simceResults && (
                                    <Grid item xs={12}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Resultados SIMCE
                                                </Typography>
                                                <Box>
                                                    <Table size="small">
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell 
                                                                    component="th"
                                                                    sx={{ 
                                                                        fontWeight: 'bold',
                                                                        color: 'primary.main',
                                                                        width: '50%'
                                                                    }}
                                                                >
                                                                    Matemáticas
                                                                </TableCell>
                                                                <TableCell>{student?.simceResults.math}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell 
                                                                    component="th"
                                                                    sx={{ 
                                                                        fontWeight: 'bold',
                                                                        color: 'primary.main'
                                                                    }}
                                                                >
                                                                    Lenguaje
                                                                </TableCell>
                                                                <TableCell>{student?.simceResults.language}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student?.academicRecord && (
                                    <Grid item xs={12}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Registro Académico
                                                </Typography>
                                                <Box>
                                                    <Table size="small">
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell 
                                                                    component="th"
                                                                    sx={{ 
                                                                        fontWeight: 'bold',
                                                                        color: 'primary.main',
                                                                        width: '50%'
                                                                    }}
                                                                >
                                                                    Matemáticas
                                                                </TableCell>
                                                                <TableCell>{student?.academicRecord.math}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell 
                                                                    component="th"
                                                                    sx={{ 
                                                                        fontWeight: 'bold',
                                                                        color: 'primary.main'
                                                                    }}
                                                                >
                                                                    Lenguaje
                                                                </TableCell>
                                                                <TableCell>{student?.academicRecord.language}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </TabPanel>

                        {/* Tab: Información Familiar */}
                        <TabPanel value={tabValue} index={1}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={styles.contentCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Información de Contacto
                                            </Typography>
                                            <List>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <Home color="primary" />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Dirección</Typography>}
                                                        secondary={student?.address || 'No registrada'} 
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <LocationCity color="primary" />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Ubicación</Typography>}
                                                        secondary={`${student?.comuna}, ${student?.region}`} 
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card sx={styles.contentCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Apoderado Titular
                                            </Typography>
                                            {student?.apoderadoTitular && (
                                                <List>
                                                    {Object.entries(student?.apoderadoTitular).map(([key, value]) => (
                                                        <ListItem key={key}>
                                                            <ListItemText 
                                                                primary={<Typography variant="subtitle2">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>}
                                                                secondary={value} 
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {student?.apoderadoSuplente && (
                                    <Grid item xs={12} md={6}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Apoderado Suplente
                                                </Typography>
                                                <List>
                                                    {Object.entries(student?.apoderadoSuplente).map(([key, value]) => (
                                                        <ListItem key={key}>
                                                            <ListItemText 
                                                                primary={<Typography variant="subtitle2">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>}
                                                                secondary={value} 
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student?.contactosEmergencia && (
                                    <Grid item xs={12}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Contactos de Emergencia
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {student?.contactosEmergencia.map((contacto, index) => (
                                                        <Grid item xs={12} md={4} key={index}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <List>
                                                                        {Object.entries(contacto).map(([key, value]) => (
                                                                            <ListItem key={key}>
                                                                                <ListItemText 
                                                                                    primary={<Typography variant="subtitle2">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>}
                                                                                    secondary={value} 
                                                                                />
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student?.grupoFamiliar && (
                                    <Grid item xs={12}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Grupo Familiar
                                                </Typography>
                                                <Typography variant="body1">
                                                    {student?.grupoFamiliar}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </TabPanel>

                        {/* Tab: Salud */}
                        <TabPanel value={tabValue} index={2}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={styles.contentCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Información Básica de Salud
                                            </Typography>
                                            <List>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Previsión</Typography>}
                                                        secondary={student?.prevision || 'No registrada'} 
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Grupo Sanguíneo</Typography>}
                                                        secondary={student?.grupoSanguineo || 'No registrado'} 
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {student?.condicionesMedicas && (
                                    <Grid item xs={12} md={6}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Condiciones Médicas
                                                </Typography>
                                                <List>
                                                    {student?.condicionesMedicas.map((condicion, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText primary={condicion} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student?.alergias && (
                                    <Grid item xs={12} md={6}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Alergias
                                                </Typography>
                                                <List>
                                                    {student?.alergias.map((alergia, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText primary={alergia} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student?.medicamentos && (
                                    <Grid item xs={12} md={6}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Medicamentos
                                                </Typography>
                                                <List>
                                                    {student?.medicamentos.map((medicamento, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText primary={medicamento} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </TabPanel>

                        {/* Tab: Necesidades Educativas Especiales */}
                        <TabPanel value={tabValue} index={3}>
                            <Grid container spacing={3}>
                                {student?.diagnosticoPIE && (
                                    <Grid item xs={12}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Diagnóstico PIE
                                                </Typography>
                                                <Box>
                                                    <Table size="small">
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell 
                                                                    component="th" 
                                                                    sx={{ 
                                                                        fontWeight: 'bold',
                                                                        color: 'primary.main',
                                                                        width: '50%'
                                                                    }}
                                                                >
                                                                    Diagnóstico
                                                                </TableCell>
                                                                <TableCell>{student?.diagnosticoPIE.diagnosis}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student?.necesidadesEducativas && (
                                    <Grid item xs={12}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Necesidades Educativas Especiales
                                                </Typography>
                                                <Box>
                                                    <Table size="small">
                                                        <TableBody>
                                                            {Object.entries(student?.necesidadesEducativas).map(([key, value]) => (
                                                                <TableRow key={key}>
                                                                    <TableCell 
                                                                        component="th"
                                                                        sx={{ 
                                                                            fontWeight: 'bold',
                                                                            color: 'primary.main',
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                                                    </TableCell>
                                                                    <TableCell>{value}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student?.apoyosPIE && (
                                    <Grid item xs={12}>
                                        <Card sx={styles.contentCard}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Apoyos PIE
                                                </Typography>
                                                <Box>
                                                    <Table size="small">
                                                        <TableBody>
                                                            {Object.entries(student?.apoyosPIE).map(([key, value]) => (
                                                                <TableRow key={key}>
                                                                    <TableCell 
                                                                        component="th"
                                                                        sx={{ 
                                                                            fontWeight: 'bold',
                                                                            color: 'primary.main',
                                                                            width: '50%'
                                                                        }}
                                                                    >
                                                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                                                    </TableCell>
                                                                    <TableCell>{value}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </TabPanel>

                        {/* Tab: Información Socioeconómica */}
                        <TabPanel value={tabValue} index={4}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={styles.contentCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Beneficios JUNAEB
                                            </Typography>
                                            <List>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Recibe Beneficio</Typography>}
                                                        secondary={student?.beneficioJUNAEB ? 'Sí' : 'No'} 
                                                    />
                                                </ListItem>
                                                {student?.tipoBeneficioJUNAEB && (
                                                    <ListItem>
                                                        <ListItemText 
                                                            primary={<Typography variant="subtitle2">Tipos de Beneficios</Typography>}
                                                            secondary={student?.tipoBeneficioJUNAEB.join(', ')} 
                                                        />
                                                    </ListItem>
                                                )}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card sx={styles.contentCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Estado Prioritario
                                            </Typography>
                                            <List>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary={<Typography variant="subtitle2">Alumno Prioritario</Typography>}
                                                        secondary={student?.prioritario ? 'Sí' : 'No'} 
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* Tab: Intervenciones */}
                        <TabPanel value={tabValue} index={5}>
                            <Box>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Calendario de Intervenciones
                                </Typography>
                                <Box sx={{ mb: 4 }}>
                                    <SimpleInterventionsCalendar 
                                        interventions={interventionsData?.data}
                                    />
                                </Box>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Lista de Intervenciones
                                </Typography>
                                <InterventionsList 
                                    interventions={interventionsData?.data} 
                                    isLoading={isLoadingInterventions}
                                />
                            </Box>
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>

            {/* Botón flotante de edición */}
            <Fab
                color="primary"
                aria-label="edit"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 1000
                }}
                onClick={() => router.push(`/students/${id}/edit`)}
            >
                <Edit />
            </Fab>
        </Container>
    );
}