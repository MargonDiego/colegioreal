import React, { useEffect, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { studentValidationSchema } from '@/app/(dashboard)/students/register/validations/studentValidations';
import {
    Box,
    Grid,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    FormControl,
    FormControlLabel,

    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress,
    Tabs,
    Tab, Switch,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

import dayjs from 'dayjs';
import {useStudents} from "@/hooks/useStudents";

function StudentEditForm({ studentId }) {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const { data: studentsData, isLoading, error } = useStudents({
        filters: { isActive: true },
    });
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(studentValidationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            rut: '',
            email: '',
            birthDate: null,
            gender: '',
            nationality: 'Chilena',
            grade: '',
            academicYear: new Date().getFullYear(),
            section: '',
            matriculaNumber: '',
            enrollmentStatus: 'Regular',
            previousSchool: '',
            address: '',
            comuna: '',
            region: '',
            apoderadoTitular: {
                name: '',
                rut: '',
                phone: '',
                email: '',
            },
            apoderadoSuplente: {
                name: '',
                rut: '',
                phone: '',
                email: '',
            },
            contactosEmergencia: [],
            prevision: '',
            grupoSanguineo: '',
            condicionesMedicas: [],
            alergias: [],
            medicamentos: [],
            diagnosticoPIE: null,
            necesidadesEducativas: [],
            apoyosPIE: [],
            beneficioJUNAEB: false,
            tipoBeneficioJUNAEB: [],
            prioritario: false,
            preferente: false,
            becas: [],
            registroConvivencia: [],
            medidasDisciplinarias: [],
            reconocimientos: [],
            isActive: true,
            observaciones: '',
        },
    });

    useEffect(() => {
        if (studentsData?.data) {
            const student = studentsData.data.find(s => s.id === parseInt(studentId));
            if (student) {
                // Transform dates to dayjs objects
                const transformedStudent = {
                    ...student,
                    birthDate: student.birthDate ? dayjs(student.birthDate) : null,
                    fechaIngreso: student.fechaIngreso ? dayjs(student.fechaIngreso) : null
                };
                reset(transformedStudent);
            }
        }
    }, [studentsData, studentId, reset]);

// Add loading and error handling
    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error.message}</Alert>;

    const onSubmit = async (data) => {
        try {
            await updateStudent({
                id: studentId,
                data: {
                    ...data,
                    birthDate: data.birthDate ? data.birthDate.toISOString() : null,
                }
            });
            enqueueSnackbar('Estudiante actualizado correctamente', { variant: 'success' });
            router.push('/students');
        } catch (error) {
            enqueueSnackbar(error.message || 'Error al actualizar estudiante', { variant: 'error' });
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Información Personal" />
                <Tab label="Información Académica" />
                <Tab label="Familia y Contactos" />
                <Tab label="Salud" />
                <Tab label="Necesidades Educativas" />
                <Tab label="Información Socioeconómica" />
                <Tab label="Registros" />
                <Tab label="Metadatos" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre"
                                    fullWidth
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Apellido"
                                    fullWidth
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="rut"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="RUT"
                                    fullWidth
                                    error={!!errors.rut}
                                    helperText={errors.rut?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="birthDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    label="Fecha de Nacimiento"
                                    slotProps={{
                                        textField: {
                                            error: !!errors.birthDate,
                                            helperText: errors.birthDate?.message,
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.gender}>
                                    <InputLabel>Género</InputLabel>
                                    <Select {...field} label="Género">
                                        <MenuItem value="Masculino">Masculino</MenuItem>
                                        <MenuItem value="Femenino">Femenino</MenuItem>
                                        <MenuItem value="No Binario">No Binario</MenuItem>
                                        <MenuItem value="Otro">Otro</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.gender?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>
                </Grid>

            )}

            {activeTab === 1 && (
                <Grid container spacing={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="grade"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Grado"
                                        fullWidth
                                        error={!!errors.grade}
                                        helperText={errors.grade?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="academicYear"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Año Académico"
                                        fullWidth
                                        error={!!errors.academicYear}
                                        helperText={errors.academicYear?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="matriculaNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Número de Matrícula"
                                        fullWidth
                                        error={!!errors.matriculaNumber}
                                        helperText={errors.matriculaNumber?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="enrollmentStatus"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.enrollmentStatus}>
                                        <InputLabel>Estado de Matrícula</InputLabel>
                                        <Select {...field} label="Estado de Matrícula">
                                            <MenuItem value="Regular">Regular</MenuItem>
                                            <MenuItem value="Suspendido">Suspendido</MenuItem>
                                            <MenuItem value="Retirado">Retirado</MenuItem>
                                            <MenuItem value="Egresado">Egresado</MenuItem>
                                            <MenuItem value="Trasladado">Trasladado</MenuItem>
                                        </Select>
                                        <FormHelperText>{errors.enrollmentStatus?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>

                </Grid>
            )}
            {activeTab === 2 && (
                <Grid container spacing={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Dirección"
                                        fullWidth
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="comuna"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Comuna"
                                        fullWidth
                                        error={!!errors.comuna}
                                        helperText={errors.comuna?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="region"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.region}>
                                        <InputLabel>Región</InputLabel>
                                        <Select {...field} label="Región">
                                            <MenuItem value="Metropolitana">Metropolitana</MenuItem>
                                            {/* Agregar otras regiones */}
                                        </Select>
                                        <FormHelperText>{errors.region?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>

                </Grid>
            )}
            {activeTab === 3 && (
                <Grid container spacing={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="grupoSanguineo"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.grupoSanguineo}>
                                        <InputLabel>Grupo Sanguíneo</InputLabel>
                                        <Select {...field} label="Grupo Sanguíneo">
                                            <MenuItem value="A+">A+</MenuItem>
                                            <MenuItem value="O+">O+</MenuItem>
                                            {/* Agregar otros grupos sanguíneos */}
                                        </Select>
                                        <FormHelperText>{errors.grupoSanguineo?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>

                </Grid>
            )}
            {activeTab === 4 && (
                <Grid container spacing={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="diagnosticoPIE"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Diagnóstico PIE"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        error={!!errors.diagnosticoPIE}
                                        helperText={errors.diagnosticoPIE?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="necesidadesEducativas"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Necesidades Educativas"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        error={!!errors.necesidadesEducativas}
                                        helperText={errors.necesidadesEducativas?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="apoyosPIE"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Apoyos PIE"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        error={!!errors.apoyosPIE}
                                        helperText={errors.apoyosPIE?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                </Grid>
            )}
            {activeTab === 5 && (
                <Grid container spacing={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="beneficioJUNAEB"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Switch {...field} />}
                                        label="¿Recibe beneficio JUNAEB?"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="tipoBeneficioJUNAEB"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Tipo de Beneficio JUNAEB"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        error={!!errors.tipoBeneficioJUNAEB}
                                        helperText={errors.tipoBeneficioJUNAEB?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="prioritario"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Switch {...field} />}
                                        label="¿Es prioritario?"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="preferente"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Switch {...field} />}
                                        label="¿Es preferente?"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                </Grid>
            )}
            {activeTab === 6 && (
                <Grid container spacing={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="registroConvivencia"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Registro de Convivencia"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!errors.registroConvivencia}
                                        helperText={errors.registroConvivencia?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="medidasDisciplinarias"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Medidas Disciplinarias"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        error={!!errors.medidasDisciplinarias}
                                        helperText={errors.medidasDisciplinarias?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="reconocimientos"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Reconocimientos"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        error={!!errors.reconocimientos}
                                        helperText={errors.reconocimientos?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                </Grid>
            )}
            {activeTab === 7 && (
                <Grid container spacing={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="observaciones"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Observaciones"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!errors.observaciones}
                                        helperText={errors.observaciones?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Switch {...field} />}
                                        label="¿Está activo?"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                </Grid>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={() => router.push('/students')}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Guardar Cambios
                </Button>
            </Box>
        </Box>
    );
}

export default StudentEditForm;
