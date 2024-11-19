'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Container, Paper, Typography, Avatar, Box, Chip, Button,
    Grid, Card, CardContent, Tabs, Tab, IconButton,
    LinearProgress, Divider, CircularProgress, Alert
} from '@mui/material';
import {
    Person, School, HealthAndSafety, People,
    Edit, ArrowBack, CheckCircle, Warning,
    Book, CalendarToday, EmojiEvents, Error, LocalHospital, ContactEmergency, Groups
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStudents } from '@/hooks/useStudents';
import ProtectedResource from '@/components/auth/ProtectedResource';

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

    if (!student) return (
        <Alert severity="error">Estudiante no encontrado</Alert>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header con información principal */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%)'
                }}
            >
                <Box display="flex" alignItems="center" gap={3}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'primary.main',
                            fontSize: '2rem'
                        }}
                    >
                        {student.firstName[0]}{student.lastName[0]}
                    </Avatar>
                    <Box flex={1}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {student.firstName} {student.lastName}
                        </Typography>
                        <Box display="flex" gap={1}>
                            <Chip label={student.grade} variant="outlined" />
                            <Chip label={student.matriculaNumber} variant="outlined" />
                            <Chip
                                label={student.enrollmentStatus}
                                color={student.enrollmentStatus === 'Regular' ? 'success' : 'default'}
                            />
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                    >
                        Volver
                    </Button>
                </Box>
            </Paper>

            {/* Indicadores clave */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.light' }}>
                                <Book />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="body2">
                                    Promedio General
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {student.academicRecord?.average || 'N/A'}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'success.light' }}>
                                <CalendarToday />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="body2">
                                    Asistencia
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    95%
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'warning.light' }}>
                                <EmojiEvents />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="body2">
                                    Reconocimientos
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {student.reconocimientos?.length || 0}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'error.light' }}>
                                <Warning />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="body2">
                                    Anotaciones
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {student.medidasDisciplinarias?.length || 0}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs con contenido principal */}
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<Person />} label="Información Personal" />
                    <Tab icon={<School />} label="Información Académica" />
                    <Tab icon={<HealthAndSafety />} label="Salud" />
                    <Tab icon={<People />} label="Familia" />
                </Tabs>

                {/* Tab: Información Personal */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Person /> Datos Personales
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography><strong>RUT:</strong> {student.rut}</Typography>
                                        <Typography><strong>Email:</strong> {student.email}</Typography>
                                        <Typography>
                                            <strong>Fecha de Nacimiento:</strong> {new Date(student.birthDate).toLocaleDateString()}
                                        </Typography>
                                        <Typography><strong>Género:</strong> {student.gender}</Typography>
                                        <Typography><strong>Nacionalidad:</strong> {student.nationality}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <School /> Ubicación
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography><strong>Dirección:</strong> {student.address}</Typography>
                                        <Typography><strong>Comuna:</strong> {student.comuna}</Typography>
                                        <Typography><strong>Región:</strong> {student.region}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Tab: Información Académica */}
                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Rendimiento Académico
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Resultados SIMCE
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {Object.entries(student.simceResults || {}).map(([subject, score]) => (
                                            score && (
                                                <Box key={subject} sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography>{subject}</Typography>
                                                        <Typography>{score} pts</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(score/1000) * 100}
                                                        sx={{ height: 8, borderRadius: 4 }}
                                                    />
                                                </Box>
                                            )
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>
                {/* Tab: Salud */}
                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HealthAndSafety /> Información Médica Básica
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1"><strong>Grupo Sanguíneo:</strong></Typography>
                                            <Chip
                                                label={student.grupoSanguineo || 'No especificado'}
                                                color="error"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1"><strong>Previsión:</strong></Typography>
                                            <Chip
                                                label={student.prevision || 'No especificada'}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Warning /> Alertas Médicas
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom><strong>Alergias:</strong></Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {student.alergias?.length > 0 ? (
                                                student.alergias.map((alergia, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={alergia}
                                                        color="error"
                                                        size="small"
                                                        sx={{ marginBottom: 1 }}
                                                    />
                                                ))
                                            ) : (
                                                <Typography color="text.secondary">No se han registrado alergias</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospital /> Condiciones Médicas y Medicamentos
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle1" gutterBottom><strong>Condiciones Médicas:</strong></Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {student.condicionesMedicas?.length > 0 ? (
                                                    student.condicionesMedicas.map((condicion, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={condicion}
                                                            color="warning"
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ marginBottom: 1 }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography color="text.secondary">No se han registrado condiciones médicas</Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle1" gutterBottom><strong>Medicamentos:</strong></Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {student.medicamentos?.length > 0 ? (
                                                    student.medicamentos.map((medicamento, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={medicamento}
                                                            color="info"
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ marginBottom: 1 }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography color="text.secondary">No se han registrado medicamentos</Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>
                {/* Tab: Familia */}
                <TabPanel value={tabValue} index={3}>
                    <Grid container spacing={3}>
                        {/* Apoderado Titular */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <Person />
                                        </Avatar>
                                        <Typography variant="h6">Apoderado Titular</Typography>
                                    </Box>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'background.default',
                                        borderRadius: 1,
                                        '& > *:not(:last-child)': { mb: 2 }
                                    }}>
                                        <Typography>
                                            <strong>Nombre:</strong> {student.apoderadoTitular?.name}
                                        </Typography>
                                        <Typography>
                                            <strong>RUT:</strong> {student.apoderadoTitular?.rut}
                                        </Typography>
                                        <Typography>
                                            <strong>Teléfono:</strong> {student.apoderadoTitular?.phone}
                                        </Typography>
                                        <Typography>
                                            <strong>Email:</strong> {student.apoderadoTitular?.email}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Apoderado Suplente */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                            <People />
                                        </Avatar>
                                        <Typography variant="h6">Apoderado Suplente</Typography>
                                    </Box>
                                    {student.apoderadoSuplente?.name ? (
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: 'background.default',
                                            borderRadius: 1,
                                            '& > *:not(:last-child)': { mb: 2 }
                                        }}>
                                            <Typography>
                                                <strong>Nombre:</strong> {student.apoderadoSuplente.name}
                                            </Typography>
                                            <Typography>
                                                <strong>RUT:</strong> {student.apoderadoSuplente.rut}
                                            </Typography>
                                            <Typography>
                                                <strong>Teléfono:</strong> {student.apoderadoSuplente.phone}
                                            </Typography>
                                            <Typography>
                                                <strong>Email:</strong> {student.apoderadoSuplente.email}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography color="text.secondary">
                                            No se ha registrado un apoderado suplente
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Contactos de Emergencia */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'error.main' }}>
                                            <ContactEmergency />
                                        </Avatar>
                                        <Typography variant="h6">Contactos de Emergencia</Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {student.contactosEmergencia?.map((contacto, index) => (
                                            <Grid item xs={12} md={4} key={index}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography variant="subtitle2" color="primary" gutterBottom>
                                                            Contacto {index + 1}
                                                        </Typography>
                                                        <Typography><strong>Nombre:</strong> {contacto.name}</Typography>
                                                        <Typography><strong>Teléfono:</strong> {contacto.phone}</Typography>
                                                        <Typography><strong>Relación:</strong> {contacto.relationship}</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                        {(!student.contactosEmergencia || student.contactosEmergencia.length === 0) && (
                                            <Grid item xs={12}>
                                                <Alert severity="info">
                                                    No se han registrado contactos de emergencia
                                                </Alert>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Grupo Familiar */}
                        {student.grupoFamiliar && (
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Avatar sx={{ bgcolor: 'info.main' }}>
                                                <Groups />
                                            </Avatar>
                                            <Typography variant="h6">Grupo Familiar</Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                            {student.grupoFamiliar}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>
            </Paper>

            {/* Botón de edición */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <ProtectedResource entity="student" operation="UPDATE">
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => router.push(`/students/${id}/edit`)}
                    >
                        Editar Estudiante
                    </Button>
                </ProtectedResource>
            </Box>
        </Container>
    );
}