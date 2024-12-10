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

// Constantes (igual que en new/page.js)
const interventionTypes = [
    'Académica', 'Conductual', 'Emocional', 'Social', 'Familiar', 
    'Asistencia', 'Derivación', 'PIE', 'Convivencia Escolar', 
    'Orientación', 'Otro'
]

const interventionStatus = [
    'Pendiente', 'En Proceso', 'En Espera', 'Finalizada', 
    'Derivada', 'Cancelada'
]

const priorityLevels = ['Baja', 'Media', 'Alta', 'Urgente']

const interventionScopes = [
    'Individual', 'Grupal', 'Curso', 'Nivel', 'Establecimiento'
]

const commonActions = [
    'Entrevista con estudiante', 'Entrevista con apoderado', 
    'Derivación a psicólogo', 'Derivación a orientación', 
    'Derivación a convivencia escolar', 'Derivación a PIE', 
    'Reunión con profesores', 'Llamada telefónica', 
    'Visita domiciliaria', 'Otro'
]

export default function InterventionForm({ 
    initialData = null, 
    onSubmit: customOnSubmit = null,
    studentsData: externalStudentsData = null,
    usersData: externalUsersData = null
}) {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const { createMutation, updateMutation } = useInterventions()
    const { data: studentsQueryData } = useStudents()
    const { data: usersQueryData } = useUsers()
    const { user: currentUser } = useAuthStore()

    // Priorizar datos externos sobre datos de hook
    const studentsData = externalStudentsData || studentsQueryData
    const usersData = externalUsersData || usersQueryData

    // Logs de depuración
    useEffect(() => {
        console.log('External Students Data:', externalStudentsData)
        console.log('Query Students Data:', studentsQueryData)
        console.log('Final Students Data:', studentsData)
        console.log('External Users Data:', externalUsersData)
        console.log('Query Users Data:', usersQueryData)
        console.log('Final Users Data:', usersData)
    }, [externalStudentsData, studentsQueryData, externalUsersData, usersQueryData])

    // Transformar datos para incluir nombre completo
    const processedStudentsData = (Array.isArray(studentsData) 
        ? studentsData 
        : studentsData?.data || []).map(student => ({
            ...student,
            name: `${student.firstName} ${student.lastName}`
        }))

    const processedUsersData = (Array.isArray(usersData) 
        ? usersData 
        : usersData?.data || []).map(user => ({
            ...user,
            name: `${user.firstName} ${user.lastName}`
        }))

    const isEditMode = !!initialData

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
    } = useForm({
        defaultValues: isEditMode 
            ? {
                ...initialData,
                dateReported: initialData.dateReported ? dayjs(initialData.dateReported) : dayjs(),
                followUpDate: initialData.followUpDate ? dayjs(initialData.followUpDate) : null,
                studentId: initialData.student?.id || '',
                informerId: initialData.informer?.id || currentUser?.id || '',
                responsibleId: initialData.responsible?.id || '',
                actionsTaken: initialData.actionsTaken || [],
            }
            : {
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
            // Formatear datos
            const formattedData = {
                ...data,
                dateReported: data.dateReported ? dayjs(data.dateReported).toISOString() : null,
                followUpDate: data.followUpDate ? dayjs(data.followUpDate).toISOString() : null,
                student: { id: data.studentId },
                informer: { id: data.informerId },
                responsible: { id: data.responsibleId }
            }

            // Si hay un onSubmit personalizado, usarlo
            if (customOnSubmit) {
                await customOnSubmit(formattedData)
                return
            }

            // Lógica de creación o actualización
            if (isEditMode && initialData?.id) {
                await updateMutation.mutateAsync({ 
                    id: initialData.id, 
                    data: formattedData 
                })
                router.push('/interventions')
                enqueueSnackbar('Intervención actualizada exitosamente', { variant: 'success' })
            } else {
                await createMutation.mutateAsync(formattedData)
                router.push('/interventions')
                enqueueSnackbar('Intervención creada exitosamente', { variant: 'success' })
            }
        } catch (error) {
            console.error('Error en el formulario:', error)
            enqueueSnackbar(error.message || 'Error al guardar la intervención', { variant: 'error' })
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
                    {isEditMode ? 'Editar Intervención' : 'Nueva Intervención'}
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

                        <Grid item xs={12} md={6}>
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

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="dateReported"
                                control={control}
                                render={({ field }) => (
                                    <DateTimePicker
                                        {...field}
                                        label="Fecha de reporte"
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth />
                                        )}
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
                                        label="Fecha de seguimiento"
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

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
                                name="actionsTaken"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Acciones tomadas</InputLabel>
                                        <Select
                                            {...field}
                                            label="Acciones tomadas"
                                            multiple
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
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

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="outcomeEvaluation"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Evaluación del resultado"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
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
                                            {processedStudentsData.map((student) => (
                                                <MenuItem key={student.id} value={student.id}>
                                                    {student.name}
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
                                name="informerId"
                                control={control}
                                rules={{ required: 'El informante es requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.informerId}>
                                        <InputLabel>Informante</InputLabel>
                                        <Select {...field} label="Informante">
                                            {processedUsersData.map((user) => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    {user.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.informerId && (
                                            <FormHelperText>{errors.informerId.message}</FormHelperText>
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
                                    <FormControl fullWidth>
                                        <InputLabel>Responsable</InputLabel>
                                        <Select {...field} label="Responsable">
                                            {processedUsersData.map((user) => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    {user.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="requiresExternalReferral"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Requiere derivación externa</InputLabel>
                                        <Select {...field} label="Requiere derivación externa">
                                            <MenuItem value={true}>Sí</MenuItem>
                                            <MenuItem value={false}>No</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="externalReferralDetails"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Detalles de la derivación externa"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="documentacion"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Documentación"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="acuerdos"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Acuerdos"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="seguimientoPIE"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Seguimiento PIE"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="estrategiasImplementadas"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Estrategias implementadas"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="recursos"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Recursos"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
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
                                    />
                                )}
                            />
                        </Grid>

                        {/* Botones de acción */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => router.push('/interventions')}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                >
                                    {isEditMode ? 'Actualizar' : 'Crear'} Intervención
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    )
}
