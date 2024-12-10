'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, AlertCircle } from 'lucide-react';
import {
    Button,
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Box,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import { studentValidationSchema } from './validations/studentValidations';
import { useStudents } from '@/hooks/useStudents';
import PersonalInfoForm from './forms/PersonalInfoForm';
import AcademicInfoForm from './forms/AcademicInfoForm';
import GuardianInfoForm from './forms/GuardianInfoForm';
import HealthInfoForm from './forms/HealthInfoForm';
import EmergencyContactsForm from './forms/EmergencyContactsForm';
import RecordInfoForm from './forms/RecordInfoForm';
import ObservationsForm from './forms/ObservationsForm';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

const formSteps = [
    {
        component: PersonalInfoForm,
        label: 'Información Personal',
        description: 'Datos personales del estudiante',
        requiredFields: ['firstName', 'lastName', 'rut', 'birthDate'],
        icon: 'person'
    },
    {
        component: AcademicInfoForm,
        label: 'Información Académica',
        description: 'Información académica y de matrícula',
        requiredFields: ['grade', 'academicYear', 'matriculaNumber'],
        icon: 'school'
    },
    {
        component: GuardianInfoForm,
        label: 'Información del Apoderado',
        description: 'Datos del apoderado titular y suplente',
        requiredFields: ['apoderadoTitular.name', 'apoderadoTitular.rut', 'apoderadoTitular.phone', 'apoderadoTitular.email'],
        icon: 'people'
    },
    {
        component: HealthInfoForm,
        label: 'Información de Salud',
        description: 'Información médica relevante',
        requiredFields: [],
        icon: 'medkit'
    },
    {
        component: EmergencyContactsForm,
        label: 'Contactos de Emergencia',
        description: 'Contactos en caso de emergencia',
        requiredFields: ['contactosEmergencia'],
        icon: 'phone'
    },
    {
        component: RecordInfoForm,
        label: 'Registro Académico',
        description: 'Calificaciones y resultados SIMCE',
        requiredFields: [],
        icon: 'book'
    },
    {
        component: ObservationsForm,
        label: 'Observaciones',
        description: 'Observaciones generales y reconocimientos',
        requiredFields: [],
        icon: 'comment'
    }
];

const StudentRegisterForm = () => {
    const methods = useForm({
        resolver: yupResolver(studentValidationSchema),
        mode: 'onChange'
    });

    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { createStudent } = useStudents();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const CurrentStepComponent = formSteps[activeStep].component;

    const handleNext = async () => {
        const fields = formSteps[activeStep].requiredFields;
        const result = await methods.trigger(fields);
        
        if (result) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createStudent(data);
            enqueueSnackbar('Estudiante registrado exitosamente', { variant: 'success' });
            router.push('/students');
        } catch (err) {
            setError(err.message || 'Error al registrar estudiante');
            enqueueSnackbar('Error al registrar estudiante', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <Paper 
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 1200,
                    mx: 'auto',
                    borderRadius: 2,
                    backgroundColor: 'background.paper'
                }}
            >
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                        mb: 4,
                        color: 'primary.main',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}
                >
                    Registro de Estudiante
                </Typography>

                <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel
                    sx={{
                        mb: 4,
                        '& .MuiStepLabel-label': {
                            mt: 1,
                            fontSize: '0.875rem'
                        },
                        '& .MuiStepIcon-root': {
                            width: 35,
                            height: 35,
                            '&.Mui-active': {
                                color: 'primary.main'
                            },
                            '&.Mui-completed': {
                                color: 'success.main'
                            }
                        }
                    }}
                >
                    {formSteps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {step.label}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        display: 'block',
                                        color: 'text.secondary',
                                        mt: 0.5
                                    }}
                                >
                                    {step.description}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mt: 4, minHeight: 400 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CurrentStepComponent />
                        </motion.div>
                    </AnimatePresence>
                </Box>

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <AlertCircle size={20} style={{ marginRight: 8 }} />
                        {error}
                    </Alert>
                )}

                <Box 
                    sx={{ 
                        mt: 4,
                        pt: 3,
                        borderTop: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Button
                        disabled={activeStep === 0 || isSubmitting}
                        onClick={handleBack}
                        startIcon={<ChevronLeft />}
                        sx={{ 
                            minWidth: 120,
                            '&.Mui-disabled': {
                                opacity: 0
                            }
                        }}
                    >
                        Anterior
                    </Button>

                    {activeStep === formSteps.length - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={methods.handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                            sx={{ 
                                minWidth: 120,
                                position: 'relative'
                            }}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            endIcon={<ChevronRight />}
                            sx={{ minWidth: 120 }}
                        >
                            Siguiente
                        </Button>
                    )}
                </Box>
            </Paper>
        </FormProvider>
    );
};

export default StudentRegisterForm;
