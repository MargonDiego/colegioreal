'use client'

import { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    OutlinedInput,
    FormHelperText,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { useInterventions } from '@/hooks/useInterventions'
import { useStudents } from '@/hooks/useStudents'
import { useUsers } from '@/hooks/useUsers'
import useAuthStore from '@/hooks/useAuth'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const interventionTypes = [
    'Académica',
    'Conductual',
    'Emocional',
    'Social',
    'Familiar',
    'Asistencia',
    'Derivación',
    'PIE',
    'Convivencia Escolar',
    'Orientación',
    'Otro'
]

const interventionStatus = [
    'Pendiente',
    'En Proceso',
    'En Espera',
    'Finalizada',
    'Derivada',
    'Cancelada'
]

const priorityLevels = [
    'Baja',
    'Media',
    'Alta',
    'Urgente'
]

const interventionScopes = [
    'Individual',
    'Grupal',
    'Curso',
    'Nivel',
    'Establecimiento'
]

const commonActions = [
    'Entrevista con estudiante',
    'Entrevista con apoderado',
    'Derivación a psicólogo',
    'Derivación a orientación',
    'Derivación a convivencia escolar',
    'Derivación a PIE',
    'Reunión con profesores',
    'Llamada telefónica',
    'Visita domiciliaria',
    'Otro'
]

export default function NewInterventionPage() {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const { createMutation } = useInterventions()
    const { data: studentsData } = useStudents()
    const { data: usersData } = useUsers()
    const { user: currentUser } = useAuthStore()

    useEffect(() => {
        console.log('Users Data:', usersData)
    }, [usersData])

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            type: 'Otro',
            status: 'Pendiente',
            priority: 'Media',
            dateReported: dayjs(),
            followUpDate: null,
            interventionScope: 'Individual',
            actionsTaken: [],
            outcomeEvaluation: '',
            studentId: '',
            informerId: currentUser?.id || '', 
            responsibleId: '',
            requiresExternalReferral: false,
            externalReferralDetails: '',
            documentacion: '',
            acuerdos: '',
            seguimientoPIE: '',
            estrategiasImplementadas: '',
            recursos: '',
            observaciones: '',
        }
    })

    const onSubmit = async (data) => {
        try {
            // Format the data
            const formattedData = {
                ...data,
                dateReported: data.dateReported ? dayjs(data.dateReported).toISOString() : null,
                followUpDate: data.followUpDate ? dayjs(data.followUpDate).toISOString() : null,
                student: { id: data.studentId },
                informer: { id: data.informerId },
                responsible: { id: data.responsibleId }
            };

            console.log('Submitting intervention data:', formattedData);
            await createMutation.mutateAsync(formattedData);
            router.push('/interventions');
            enqueueSnackbar('Intervención creada exitosamente', { variant: 'success' });
        } catch (error) {
            console.error('Error creating intervention:', error);
            enqueueSnackbar(error.message || 'Error al crear la intervención', { variant: 'error' });
        }
    }

    useEffect(() => {
        if (currentUser?.id) {
            setValue('informerId', currentUser.id)
        }
    }, [currentUser, setValue])

    return (
        <Box sx={{ p: 3, pt: 12, height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4,
                    borderRadius: 2,
                    background: (theme) => 
                        theme.palette.mode === 'dark' 
                            ? 'linear-gradient(180deg, rgba(66,66,66,1) 0%, rgba(33,33,33,1) 100%)' 
                            : 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)'
                }}
            >
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                        mb: 4,
                        fontWeight: 'medium',
                        color: 'primary.main',
                        borderBottom: '2px solid',
                        borderColor: 'primary.main',
                        pb: 1
                    }}
                >
                    Nueva Intervención
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {/* Sección: Información Básica */}
                        <Grid item xs={12}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 2,
                                    color: 'text.secondary',
                                    fontWeight: 500
                                }}
                            >
                                Información Básica
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Título"
                                        fullWidth
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.type}>
                                        <InputLabel>Tipo</InputLabel>
                                        <Select 
                                            {...field} 
                                            label="Tipo"
                                            sx={{
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            {interventionTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.type && (
                                            <FormHelperText>{errors.type.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Descripción"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Sección: Estado y Fechas */}
                        <Grid item xs={12}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mt: 2,
                                    mb: 2,
                                    color: 'text.secondary',
                                    fontWeight: 500
                                }}
                            >
                                Estado y Fechas
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.status}>
                                        <InputLabel>Estado</InputLabel>
                                        <Select 
                                            {...field} 
                                            label="Estado"
                                            sx={{
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            {interventionStatus.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.status && (
                                            <FormHelperText>{errors.status.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.priority}>
                                        <InputLabel>Prioridad</InputLabel>
                                        <Select 
                                            {...field} 
                                            label="Prioridad"
                                            sx={{
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            {priorityLevels.map((priority) => (
                                                <MenuItem key={priority} value={priority}>
                                                    {priority}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.priority && (
                                            <FormHelperText>{errors.priority.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="dateReported"
                                control={control}
                                render={({ field }) => (
                                    <DateTimePicker
                                        {...field}
                                        label="Fecha de Reporte"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.dateReported,
                                                helperText: errors.dateReported?.message,
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': {
                                                            borderColor: 'primary.main',
                                                        },
                                                    },
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Sección: Participantes */}
                        <Grid item xs={12}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mt: 2,
                                    mb: 2,
                                    color: 'text.secondary',
                                    fontWeight: 500
                                }}
                            >
                                Participantes
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="studentId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.studentId}>
                                        <InputLabel>Estudiante</InputLabel>
                                        <Select
                                            {...field}
                                            label="Estudiante"
                                            sx={{
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            {studentsData?.data?.map((student) => (
                                                <MenuItem key={student.id} value={student.id}>
                                                    {`${student.firstName} ${student.lastName}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.studentId && (
                                            <FormHelperText>{errors.studentId.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="responsibleId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.responsibleId}>
                                        <InputLabel>Responsable</InputLabel>
                                        <Select
                                            {...field}
                                            label="Responsable"
                                            sx={{
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            {usersData?.map((user) => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Typography>
                                                            {`${user.firstName} ${user.lastName}`}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {user.staffType}
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.responsibleId && (
                                            <FormHelperText>{errors.responsibleId.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Acciones Tomadas */}
                        <Grid item xs={12}>
                            <Controller
                                name="actionsTaken"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Acciones Tomadas</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            input={<OutlinedInput label="Acciones Tomadas" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                                        width: 250,
                                                    },
                                                },
                                            }}
                                        >
                                            {commonActions.map((action) => (
                                                <MenuItem key={action} value={action}>
                                                    {action}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Campos adicionales */}
                        <Grid item xs={12}>
                            <Controller
                                name="outcomeEvaluation"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Evaluación de Resultados"
                                        fullWidth
                                        multiline
                                        rows={3}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="requiresExternalReferral"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Requiere Derivación Externa</InputLabel>
                                        <Select {...field} label="Requiere Derivación Externa">
                                            <MenuItem value={true}>Sí</MenuItem>
                                            <MenuItem value={false}>No</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {watch('requiresExternalReferral') && (
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="externalReferralDetails"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Detalles de Derivación Externa"
                                            fullWidth
                                            multiline
                                            rows={2}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Controller
                                name="documentacion"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Documentación"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Ingrese la documentación relevante para esta intervención"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="acuerdos"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Acuerdos"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Ingrese los acuerdos establecidos durante la intervención"
                                    />
                                )}
                            />
                        </Grid>

                        {watch('type') === 'PIE' && (
                            <Grid item xs={12}>
                                <Controller
                                    name="seguimientoPIE"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Seguimiento PIE"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Ingrese el seguimiento del Programa de Integración Escolar"
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Controller
                                name="estrategiasImplementadas"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Estrategias Implementadas"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Describa las estrategias implementadas durante la intervención"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="recursos"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Recursos"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Detalle los recursos utilizados o necesarios"
                                    />
                                )}
                            />
                        </Grid>

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
                                        rows={3}
                                        placeholder="Agregue observaciones adicionales sobre la intervención"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Botones */}
                        <Grid item xs={12}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                mt: 4,
                                gap: 2
                            }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => router.push('/interventions')}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        boxShadow: 2,
                                        '&:hover': {
                                            boxShadow: 4
                                        }
                                    }}
                                >
                                    Crear Intervención
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    )
}
