'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Container, Paper, Typography, Avatar, Box, Chip, Button,
    Grid, Card, CardContent, Tabs, Tab, IconButton,
    LinearProgress, Divider, CircularProgress, Alert,
    List, ListItem, ListItemText, ListItemIcon
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

export default function StudentDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const { data, isLoading, isError } = useStudents();
    const { data: interventionsData, isLoading: isLoadingInterventions } = useInterventions({
        filters: {
            studentId: parseInt(id)
        }
    });

    useEffect(() => {
        if (!isLoading && data) {
            const studentsArray = Array.isArray(data.data) ? data.data : [];
            const studentData = studentsArray.find((item) => item.id === parseInt(id));
            if (studentData) setStudent(studentData);
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Detalle del Estudiante
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Tarjeta de información básica */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mb: 2,
                                        bgcolor: 'primary.main'
                                    }}
                                >
                                    {student.firstName?.[0]}{student.lastName?.[0]}
                                </Avatar>
                                <Typography variant="h5" align="center">
                                    {student.firstName} {student.lastName}
                                </Typography>
                                <Chip
                                    label={student.enrollmentStatus}
                                    color={student.enrollmentStatus === 'Regular' ? 'success' : 'warning'}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <Badge />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="RUT"
                                        secondary={student.rut}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Email />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Email"
                                        secondary={student.email || 'No registrado'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarToday />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Fecha de Nacimiento"
                                        secondary={new Date(student.birthDate).toLocaleDateString()}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Flag />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Nacionalidad"
                                        secondary={student.nationality || 'No registrada'}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Contenido principal */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ width: '100%' }}>
                        <Tabs
                            value={tabValue}
                            onChange={(e, newValue) => setTabValue(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab icon={<School />} label="Información Académica" />
                            <Tab icon={<People />} label="Información Familiar" />
                            <Tab icon={<HealthAndSafety />} label="Salud" />
                            <Tab icon={<Psychology />} label="NEE" />
                            <Tab icon={<AttachMoney />} label="Socioeconómico" />
                            <Tab icon={<LocalHospital />} label="Intervenciones" />
                        </Tabs>

                        {/* Tab: Información Académica */}
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Datos Académicos Básicos
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemIcon><Class /></ListItemIcon>
                                                    <ListItemText primary="Curso" secondary={`${student.grade} ${student.section || ''}`} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><CalendarToday /></ListItemIcon>
                                                    <ListItemText primary="Año Académico" secondary={student.academicYear} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><AssignmentInd /></ListItemIcon>
                                                    <ListItemText primary="N° Matrícula" secondary={student.matriculaNumber} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                                                    <ListItemText primary="Colegio Anterior" secondary={student.previousSchool || 'No registrado'} />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Asistencia
                                            </Typography>
                                            {student.attendance ? (
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                                    <pre style={{ margin: 0, overflow: 'auto' }}>
                                                        {JSON.stringify(student.attendance, null, 2)}
                                                    </pre>
                                                </Box>
                                            ) : (
                                                <Typography color="text.secondary">
                                                    No hay registros de asistencia
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {student.simceResults && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Resultados SIMCE
                                                </Typography>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                                    <pre style={{ margin: 0, overflow: 'auto' }}>
                                                        {JSON.stringify(student.simceResults, null, 2)}
                                                    </pre>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student.academicRecord && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Registro Académico
                                                </Typography>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                                    <pre style={{ margin: 0, overflow: 'auto' }}>
                                                        {JSON.stringify(student.academicRecord, null, 2)}
                                                    </pre>
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
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Información de Contacto
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemIcon><Home /></ListItemIcon>
                                                    <ListItemText primary="Dirección" secondary={student.address || 'No registrada'} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><LocationCity /></ListItemIcon>
                                                    <ListItemText 
                                                        primary="Ubicación" 
                                                        secondary={`${student.comuna}, ${student.region}`} 
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Apoderado Titular
                                            </Typography>
                                            {student.apoderadoTitular && (
                                                <List dense>
                                                    {Object.entries(student.apoderadoTitular).map(([key, value]) => (
                                                        <ListItem key={key}>
                                                            <ListItemText 
                                                                primary={key.charAt(0).toUpperCase() + key.slice(1)} 
                                                                secondary={value} 
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {student.apoderadoSuplente && (
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Apoderado Suplente
                                                </Typography>
                                                <List dense>
                                                    {Object.entries(student.apoderadoSuplente).map(([key, value]) => (
                                                        <ListItem key={key}>
                                                            <ListItemText 
                                                                primary={key.charAt(0).toUpperCase() + key.slice(1)} 
                                                                secondary={value} 
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student.contactosEmergencia && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Contactos de Emergencia
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {student.contactosEmergencia.map((contacto, index) => (
                                                        <Grid item xs={12} md={4} key={index}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <List dense>
                                                                        {Object.entries(contacto).map(([key, value]) => (
                                                                            <ListItem key={key}>
                                                                                <ListItemText 
                                                                                    primary={key.charAt(0).toUpperCase() + key.slice(1)} 
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

                                {student.grupoFamiliar && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Grupo Familiar
                                                </Typography>
                                                <Typography variant="body1">
                                                    {student.grupoFamiliar}
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
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Información Básica de Salud
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Previsión" 
                                                        secondary={student.prevision || 'No registrada'} 
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Grupo Sanguíneo" 
                                                        secondary={student.grupoSanguineo || 'No registrado'} 
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {student.condicionesMedicas && (
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Condiciones Médicas
                                                </Typography>
                                                <List dense>
                                                    {student.condicionesMedicas.map((condicion, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText primary={condicion} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student.alergias && (
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Alergias
                                                </Typography>
                                                <List dense>
                                                    {student.alergias.map((alergia, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText primary={alergia} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student.medicamentos && (
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Medicamentos
                                                </Typography>
                                                <List dense>
                                                    {student.medicamentos.map((medicamento, index) => (
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
                                {student.diagnosticoPIE && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Diagnóstico PIE
                                                </Typography>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                                    <pre style={{ margin: 0, overflow: 'auto' }}>
                                                        {JSON.stringify(student.diagnosticoPIE, null, 2)}
                                                    </pre>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student.necesidadesEducativas && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Necesidades Educativas Especiales
                                                </Typography>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                                    <pre style={{ margin: 0, overflow: 'auto' }}>
                                                        {JSON.stringify(student.necesidadesEducativas, null, 2)}
                                                    </pre>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {student.apoyosPIE && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Apoyos PIE
                                                </Typography>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                                    <pre style={{ margin: 0, overflow: 'auto' }}>
                                                        {JSON.stringify(student.apoyosPIE, null, 2)}
                                                    </pre>
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
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Beneficios JUNAEB
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Recibe Beneficio" 
                                                        secondary={student.beneficioJUNAEB ? 'Sí' : 'No'} 
                                                    />
                                                </ListItem>
                                                {student.tipoBeneficioJUNAEB && (
                                                    <ListItem>
                                                        <ListItemText 
                                                            primary="Tipos de Beneficios" 
                                                            secondary={student.tipoBeneficioJUNAEB.join(', ')} 
                                                        />
                                                    </ListItem>
                                                )}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Estado Prioritario
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText 
                                                        primary="Alumno Prioritario" 
                                                        secondary={student.prioritario ? 'Sí' : 'No'} 
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
                                <Typography variant="h6" gutterBottom>
                                    Calendario de Intervenciones
                                </Typography>
                                <Box sx={{ mb: 4 }}>
                                    <SimpleInterventionsCalendar 
                                        interventions={interventionsData?.data}
                                    />
                                </Box>
                                <Typography variant="h6" gutterBottom>
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

            {/* Botón de edición */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => router.push(`/students/${id}/edit`)}
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
            >
                Editar Estudiante
            </Button>
        </Container>
    );
}