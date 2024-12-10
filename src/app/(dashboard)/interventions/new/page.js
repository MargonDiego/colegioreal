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
            <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Nueva Intervención
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {/* Información básica */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'El título es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Título"
                                        fullWidth
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: 'El tipo es requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.type}>
                                        <InputLabel>Tipo</InputLabel>
                                        <Select {...field} label="Tipo">
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
                                rules={{ required: 'La descripción es requerida' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Descripción"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Estado y Prioridad */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: 'El estado es requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.status}>
                                        <InputLabel>Estado</InputLabel>
                                        <Select {...field} label="Estado">
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

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="priority"
                                control={control}
                                rules={{ required: 'La prioridad es requerida' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.priority}>
                                        <InputLabel>Prioridad</InputLabel>
                                        <Select {...field} label="Prioridad">
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

                        {/* Fechas */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="dateReported"
                                control={control}
                                rules={{ required: 'La fecha de reporte es requerida' }}
                                render={({ field }) => (
                                    <DateTimePicker
                                        {...field}
                                        label="Fecha de Reporte"
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={(newValue) => field.onChange(newValue)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.dateReported,
                                                helperText: errors.dateReported?.message
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="followUpDate"
                                control={control}
                                render={({ field }) => (
                                    <DateTimePicker
                                        {...field}
                                        label="Fecha de Seguimiento"
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={(newValue) => field.onChange(newValue)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.followUpDate,
                                                helperText: errors.followUpDate?.message
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Alcance y Participantes */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="interventionScope"
                                control={control}
                                rules={{ required: 'El alcance es requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.interventionScope}>
                                        <InputLabel>Alcance</InputLabel>
                                        <Select {...field} label="Alcance">
                                            {interventionScopes.map((scope) => (
                                                <MenuItem key={scope} value={scope}>
                                                    {scope}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.interventionScope && (
                                            <FormHelperText>{errors.interventionScope.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="studentId"
                                control={control}
                                rules={{ required: 'El estudiante es requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.studentId}>
                                        <InputLabel>Estudiante</InputLabel>
                                        <Select {...field} label="Estudiante">
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

                        {/* Campo oculto para el informante */}
                        <input 
                            type="hidden" 
                            {...register('informerId')} 
                            value={currentUser?.id || ''}
                        />

                        {/* Responsable */}
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="responsibleId"
                                control={control}
                                rules={{ required: 'El responsable es requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.responsibleId}>
                                        <InputLabel>Responsable</InputLabel>
                                        <Select
                                            {...field}
                                            label="Responsable"
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
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => router.back()}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
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
