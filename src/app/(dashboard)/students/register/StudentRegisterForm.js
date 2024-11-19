'use client'

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
            firstName: '', lastName: '', rut: '', email: null, birthDate: null, gender: 'Otro', nationality: 'Chilena', grade: '', academicYear: new Date().getFullYear(), section: null, matriculaNumber: '', enrollmentStatus: 'Regular', previousSchool: null, address: null, comuna: '', region: '',
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
            grupoFamiliar: null, contactosEmergencia: [], prevision: null, grupoSanguineo: null, condicionesMedicas: [], alergias: [], medicamentos: [], diagnosticoPIE: null, necesidadesEducativas: null, apoyosPIE: null, beneficioJUNAEB: false, tipoBeneficioJUNAEB: [], prioritario: false, preferente: false, becas: null,
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

    // Validación de RUT en tiempo real
    const watchedRut = watch('rut');

    useEffect(() => {
        let isActive = true;
        const timeoutId = setTimeout(async () => {
            try {
                // Solo validar si el RUT tiene un formato básico válido
                if (!watchedRut || watchedRut.length < 3) return;

                const normalizedRut = normalizeRut(watchedRut);

                // Validar el formato antes de hacer la llamada al servidor
                if (!validateRut(normalizedRut)) {
                    setError('rut', {
                        type: 'validation',
                        message: 'RUT inválido'
                    });
                    return;
                }

                clearErrors('rut');

                // Hacer la llamada al servidor
                const { exists, message } = await checkRutExists(normalizedRut);

                if (isActive && exists) {
                    setError('rut', {
                        type: 'validation',
                        message: 'Este RUT ya está registrado'
                    });
                }
            } catch (error) {
                console.error('Error validando RUT:', error);
            }
        }, 500);

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, [watchedRut]);

    const isFieldTouched = (field) => {
        return touchedFields[field] || formTouchedFields[field];
    };

    const getTouchedErrors = (currentStepIndex) => {
        const fieldsToValidate = formSteps[currentStepIndex].requiredFields;
        const currentErrors = {};

        fieldsToValidate.forEach(field => {
            if (errors[field] && isFieldTouched(field)) {
                currentErrors[field] = errors[field];
            }
        });

        return currentErrors;
    };

    const validateStep = async (stepIndex) => {
        const fieldsToValidate = formSteps[stepIndex].requiredFields;

        if (fieldsToValidate.length === 0) return true;

        const newTouchedFields = {};
        fieldsToValidate.forEach(field => {
            newTouchedFields[field] = true;
        });
        setTouchedFields(prev => ({ ...prev, ...newTouchedFields }));

        const isStepValid = await trigger(fieldsToValidate);
        if (!isStepValid) {
            const currentErrors = {};
            fieldsToValidate.forEach(field => {
                if (errors[field]) {
                    currentErrors[field] = errors[field];
                }
            });
            setStepErrors(prev => ({ ...prev, [stepIndex]: currentErrors }));
        }
        return isStepValid;
    };

    const handleFieldTouched = (fieldName) => {
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    };

    const processFormData = (data) => {

        const cleanedData = { ...data };
        Object.keys(cleanedData).forEach(key => {
            if (cleanedData[key] === '') {
                cleanedData[key] = null;
            }
            if (Array.isArray(cleanedData[key]) && cleanedData[key].length === 0) {
                cleanedData[key] = null;
            }
        });

        // Limpiar objetos vacíos
        if (cleanedData.apoderadoSuplente &&
            Object.values(cleanedData.apoderadoSuplente).every(val => !val)) {
            cleanedData.apoderadoSuplente = null;
        }

        return cleanedData;
    };
    const onSubmit = async (data) => {
        console.log('Form submission started with data:', data);

        if (!canCreate) {
            console.log('Permission check failed');
            enqueueSnackbar('No tiene permisos para crear estudiantes', {
                variant: 'error',
                autoHideDuration: 4000
            });
            return;
        }

        try {
            setIsSubmitting(true);

            // Normalizar y limpiar datos
            const processedData = {
                ...data,
                rut: normalizeRut(data.rut),
                apoderadoTitular: data.apoderadoTitular ? {
                    ...data.apoderadoTitular,
                    rut: normalizeRut(data.apoderadoTitular.rut)
                } : null,
                apoderadoSuplente: data.apoderadoSuplente ? {
                    ...data.apoderadoSuplente,
                    rut: data.apoderadoSuplente.rut ? normalizeRut(data.apoderadoSuplente.rut) : null
                } : null
            };

            // Eliminar campos vacíos o nulos
            const cleanedData = Object.entries(processedData).reduce((acc, [key, value]) => {
                if (value !== null && value !== '' && value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            console.log('Cleaned data to be sent:', cleanedData);

            // Crear estudiante
            const response = await createStudent(cleanedData);
            console.log('Create student response:', response);

            enqueueSnackbar('Estudiante creado exitosamente', {
                variant: 'success'
            });

            router.push('/students');
        } catch (error) {
            console.error('Form submission error:', error);
            enqueueSnackbar(error.message || 'Error al crear estudiante', {
                variant: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleNext = async () => {
        try {
            console.log('handleNext called, current step:', currentStep);
            const isStepValid = await validateStep(currentStep);
            console.log('Step validation result:', isStepValid);

            if (isStepValid) {
                if (currentStep === formSteps.length - 1) {
                    console.log('Final step reached, getting form data...');
                    const formData = methods.getValues();
                    console.log('Form data:', formData);
                    // Llamar a onSubmit directamente con los datos del formulario
                    await onSubmit(formData);
                } else {
                    setCurrentStep(prev => prev + 1);
                    window.scrollTo(0, 0);
                }
            } else {
                console.log('Step validation failed');
                enqueueSnackbar('Complete los campos requeridos', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error in handleNext:', error);
        }
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (currentStep === formSteps.length - 1) {
            const formData = methods.getValues();
            onSubmit(formData);
        } else {
            handleNext();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const CurrentStepComponent = formSteps[currentStep].component;

    if (!canCreate) {
        return (
            <Alert
                severity="error"
                className="m-4"
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => router.push('/students')}
                    >
                        Volver
                    </Button>
                }
            >
                No tiene permisos para crear estudiantes
            </Alert>
        );
    }

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
                <form onSubmit={handleFormSubmit} noValidate>
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

                            {Object.keys(getTouchedErrors(currentStep)).length > 0 && (
                                <Alert
                                    severity="error"
                                    className="mb-4"
                                    icon={<AlertCircle className="w-5 h-5" />}
                                >
                                    <Typography variant="subtitle2">
                                        Por favor corrija los siguientes errores:
                                    </Typography>
                                    <ul className="mt-1 list-disc list-inside">
                                        {Object.entries(getTouchedErrors(currentStep)).map(([field, error]) => (
                                            <li key={field} className="text-sm">
                                                {error.message || error}
                                            </li>
                                        ))}
                                    </ul>
                                </Alert>
                            )}

                            <Box className="mb-6">
                                <CurrentStepComponent onFieldTouched={handleFieldTouched} />
                            </Box>

                            <Divider className="my-6" />

                            <Box className="flex justify-between items-center">
                                <Button
                                    onClick={handleBack}
                                    disabled={currentStep === 0 || isSubmitting}
                                    startIcon={<ChevronLeft className="w-5 h-5" />}
                                    variant="outlined"
                                    size="large"
                                >
                                    Anterior
                                </Button>

                                <Box className="flex items-center gap-2">
                                    {currentStep < formSteps.length - 1 && (
                                        <Typography variant="body2" color="text.secondary">
                                            Paso {currentStep + 1} de {formSteps.length}
                                        </Typography>
                                    )}
                                    <Button
                                        type={currentStep === formSteps.length - 1 ? "submit" : "button"}
                                        onClick={currentStep === formSteps.length - 1 ? undefined : handleNext}
                                        disabled={isSubmitting}
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        endIcon={
                                            isSubmitting ? (
                                                <CircularProgress size={20} />
                                            ) : currentStep === formSteps.length - 1 ? (
                                                <Save className="w-5 h-5" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5" />
                                            )
                                        }
                                    >
                                        {isSubmitting
                                            ? 'Procesando...'
                                            : currentStep === formSteps.length - 1
                                                ? 'Guardar Estudiante'
                                                : 'Siguiente'}
                                    </Button>
                                </Box>
                            </Box>
                        </motion.div>
                    </AnimatePresence>
                </form>
            </FormProvider>

            {/* Barra de progreso */}
            <Box className="mt-8">
                <Box className="w-full bg-gray-200 rounded-full h-1">
                    <motion.div
                        className="bg-blue-600 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${((currentStep + 1) / formSteps.length) * 100}%`
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </Box>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    className="mt-2 block text-center"
                >
                    {Math.round(((currentStep + 1) / formSteps.length) * 100)}% completado
                </Typography>
            </Box>
        </Paper>
    );
}
