import React, { useEffect, useState } from 'react';

import { useForm, FormProvider } from 'react-hook-form';
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
    Alert,
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
import { useStudents } from "@/hooks/useStudents";
import PersonalInfoForm from '../../register/forms/PersonalInfoForm';
import AcademicInfoForm from '../../register/forms/AcademicInfoForm';
import EmergencyContactsForm from '../../register/forms/EmergencyContactsForm';
import HealthInfoForm from '../../register/forms/HealthInfoForm';
import ObservationsForm from '../../register/forms/ObservationsForm';
import GuardianInfoForm from '../../register/forms/GuardianInfoForm';
import RecordInfoForm from '../../register/forms/RecordInfoForm';

function StudentEditForm({ studentId }) {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    
    const { data: studentsData, isLoading, error, updateStudent } = useStudents({
        studentId: parseInt(studentId)
    });

    const methods = useForm({
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
            simceResults: {
                Lenguaje: null,
                matematica: null,
                cienciasNaturales: null,
                historiayGeografia: null
            },
            academicRecord: [],
            attendance: [],
            address: '',
            comuna: '',
            region: '',
            apoderadoTitular: {
                name: '',
                rut: '',
                phone: '',
                email: '',
                relationship: ''
            },
            apoderadoSuplente: {
                name: '',
                rut: '',
                phone: '',
                email: '',
                relationship: ''
            },
            grupoFamiliar: '',
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

    // Efecto para cargar los datos iniciales del estudiante
    useEffect(() => {
        if (studentsData?.data?.[0] && !isInitialized) {
            const student = studentsData.data[0];
            const transformedStudent = {
                ...student,
                birthDate: student.birthDate ? dayjs(student.birthDate) : null,
                fechaIngreso: student.fechaIngreso ? dayjs(student.fechaIngreso) : null,
                condicionesMedicas: Array.isArray(student.condicionesMedicas) ? student.condicionesMedicas : [],
                alergias: Array.isArray(student.alergias) ? student.alergias : [],
                medicamentos: Array.isArray(student.medicamentos) ? student.medicamentos : [],
                necesidadesEducativas: Array.isArray(student.necesidadesEducativas) ? student.necesidadesEducativas : [],
                apoyosPIE: Array.isArray(student.apoyosPIE) ? student.apoyosPIE : [],
                tipoBeneficioJUNAEB: Array.isArray(student.tipoBeneficioJUNAEB) ? student.tipoBeneficioJUNAEB : [],
                becas: Array.isArray(student.becas) ? student.becas : [],
                registroConvivencia: Array.isArray(student.registroConvivencia) ? student.registroConvivencia : [],
                medidasDisciplinarias: Array.isArray(student.medidasDisciplinarias) ? student.medidasDisciplinarias : [],
                reconocimientos: Array.isArray(student.reconocimientos) ? student.reconocimientos : [],
                contactosEmergencia: Array.isArray(student.contactosEmergencia) ? student.contactosEmergencia : []
            };
            methods.reset(transformedStudent);
            setIsInitialized(true);
        }
    }, [studentsData, methods, isInitialized]);

    const onSubmit = async (data) => {
        try {
            // Formatear las fechas antes de enviar
            const formattedData = {
                ...data,
                birthDate: data.birthDate ? dayjs(data.birthDate).format('YYYY-MM-DD') : null,
                fechaIngreso: data.fechaIngreso ? dayjs(data.fechaIngreso).format('YYYY-MM-DD') : null,
            };

            console.log('Enviando datos al servidor:', formattedData);
            
            await updateStudent({
                id: parseInt(studentId),
                data: formattedData
            });
            
            enqueueSnackbar('Estudiante actualizado correctamente', { variant: 'success' });
            router.push(`/students/${studentId}`);
        } catch (error) {
            console.error('Error detallado al actualizar estudiante:', error);
            enqueueSnackbar(error.message || 'Error al actualizar estudiante', { variant: 'error' });
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error.message}</Alert>;

    return (
        <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        mb: 3,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            minWidth: 120,
                            fontWeight: 500,
                        }
                    }}
                >
                    <Tab label="Información Personal" />
                    <Tab label="Información Académica" />
                    <Tab label="Apoderados" />
                    <Tab label="Contactos de Emergencia" />
                    <Tab label="Salud" />
                    <Tab label="Historial" />
                    <Tab label="Observaciones" />
                </Tabs>

                <Box sx={{ mt: 3 }}>
                    {activeTab === 0 && <PersonalInfoForm />}
                    {activeTab === 1 && <AcademicInfoForm />}
                    {activeTab === 2 && <GuardianInfoForm />}
                    {activeTab === 3 && <EmergencyContactsForm />}
                    {activeTab === 4 && <HealthInfoForm />}
                    {activeTab === 5 && <RecordInfoForm />}
                    {activeTab === 6 && <ObservationsForm />}
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.push('/students')}
                        sx={{ 
                            borderColor: 'grey.300',
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: 'grey.400',
                                backgroundColor: 'grey.50'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit"
                        variant="contained"
                        disabled={!isInitialized || methods.formState.isSubmitting}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'primary.dark'
                            }
                        }}
                    >
                        Guardar Cambios
                    </Button>
                </Box>
            </Box>
        </FormProvider>
    );
}

export default StudentEditForm;
