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
        requiredFields: ['firstName', 'lastName', 'rut', 'birthDate']
    },
    {
        component: AcademicInfoForm,
        label: 'Información Académica',
        description: 'Información académica y de matrícula',
        requiredFields: ['grade', 'academicYear', 'matriculaNumber']
    },
    {
        component: GuardianInfoForm,
        label: 'Información del Apoderado',
        description: 'Datos del apoderado titular y suplente',
        requiredFields: ['apoderadoTitular.name', 'apoderadoTitular.rut', 'apoderadoTitular.phone', 'apoderadoTitular.email']
    },
    {
        component: HealthInfoForm,
        label: 'Información de Salud',
        description: 'Información médica relevante',
        requiredFields: []
    },
    {
        component: EmergencyContactsForm,
        label: 'Contactos de Emergencia',
        description: 'Contactos en caso de emergencia',
        requiredFields: ['contactosEmergencia']
    },
    {
        component: RecordInfoForm,
        label: 'Registro Académico',
        description: 'Calificaciones y resultados SIMCE',
        requiredFields: []
    },
    {
        component: ObservationsForm,
        label: 'Observaciones',
        description: 'Observaciones generales y reconocimientos',
        requiredFields: []
    }
];

export default function StudentRegisterForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stepErrors, setStepErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const {
        createStudent,
        normalizeRut,
        validateRut,
        checkRutExists,
        canCreate
    } = useStudents();

    const methods = useForm({
        resolver: yupResolver(studentValidationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            rut: '',
            email: null,
            birthDate: null,
            gender: 'Otro',
            nationality: 'Chilena',
            grade: '',
            academicYear: new Date().getFullYear(),
            section: null,
            matriculaNumber: '',
            enrollmentStatus: 'Regular',
            previousSchool: null,
            address: null,
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
            grupoFamiliar: null,
            contactosEmergencia: [],
            prevision: null,
            grupoSanguineo: null,
            condicionesMedicas: [],
            alergias: [],
            medicamentos: [],
            diagnosticoPIE: null,
            necesidadesEducativas: null,
            apoyosPIE: null,
            beneficioJUNAEB: false,
            tipoBeneficioJUNAEB: [],
            prioritario: false,
            preferente: false,
            becas: null,
            simceResults: {
                comprensionLectura: null,
                escritura: null,
                matematica: null,
                cienciasNaturales: null,
                historiayGeografia: null,
                ingles: null
            },
            academicRecord: [],
            attendance: [],
            registroConvivencia: null,
            medidasDisciplinarias: [],
            reconocimientos: [],
            isActive: true,
            observaciones: null,
        },
        mode: 'onTouched'
    });

    const {
        handleSubmit,
        trigger,
        formState: { errors, touchedFields: formTouchedFields },
        getValues,
        watch,
        setError,
        clearErrors
    } = methods;

    const watchedRut = watch('rut');

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (!watchedRut || watchedRut.length < 3) return;

            const normalizedRut = normalizeRut(watchedRut);

            if (!validateRut(normalizedRut)) {
                setError('rut', {
                    type: 'validation',
                    message: 'RUT inválido'
                });
                return;
            }

            clearErrors('rut');

            const { exists } = await checkRutExists(normalizedRut);

            if (exists) {
                setError('rut', {
                    type: 'validation',
                    message: 'Este RUT ya está registrado'
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [watchedRut]);

    const handleNext = async () => {
        const isStepValid = await trigger(formSteps[currentStep].requiredFields);
        if (isStepValid) {
            setCurrentStep((prev) => prev + 1);
        } else {
            enqueueSnackbar('Complete los campos requeridos', { variant: 'error' });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const processedData = {
                ...data,
                rut: normalizeRut(data.rut),
            };

            await createStudent(processedData);

            enqueueSnackbar('Estudiante creado exitosamente', {
                variant: 'success'
            });

            router.push('/students');
        } catch (error) {
            enqueueSnackbar('Error al crear estudiante', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const CurrentStepComponent = formSteps[currentStep].component;

    return (
        <Paper elevation={3} className="p-8 max-w-4xl mx-auto">
            <Box className="mb-8">
                <Stepper activeStep={currentStep} alternativeLabel>
                    {formSteps.map((step, index) => (
                        <Step key={index}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box className="mb-6">
                                <Typography variant="h5" className="mb-2">
                                    {formSteps[currentStep].label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formSteps[currentStep].description}
                                </Typography>
                            </Box>

                            <CurrentStepComponent />

                            <Divider className="my-6" />

                            <Box className="flex justify-between items-center">
                                <Button
                                    onClick={handleBack}
                                    disabled={currentStep === 0 || isSubmitting}
                                    startIcon={<ChevronLeft />}
                                    variant="outlined"
                                    size="large"
                                >
                                    Anterior
                                </Button>

                                <Button
                                    type={currentStep === formSteps.length - 1 ? "submit" : "button"}
                                    onClick={currentStep === formSteps.length - 1 ? undefined : handleNext}
                                    disabled={isSubmitting}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    endIcon={isSubmitting ? <CircularProgress size={20} /> : <ChevronRight />}
                                >
                                    {isSubmitting ? 'Procesando...' : currentStep === formSteps.length - 1 ? 'Guardar' : 'Siguiente'}
                                </Button>
                            </Box>
                        </motion.div>
                    </AnimatePresence>
                </form>
            </FormProvider>
        </Paper>
    );
}
