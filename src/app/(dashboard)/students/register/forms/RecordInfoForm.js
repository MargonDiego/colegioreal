import React from 'react';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { Grid, TextField, IconButton, Typography, Button, Divider } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const SIMCE_MIN_SCORE = 0;
const SIMCE_MAX_SCORE = 1000;

export default function RecordInfoForm() {
    const { control, formState: { errors } } = useFormContext();

    const {
        fields: academicFields,
        append: appendAcademic,
        remove: removeAcademic
    } = useFieldArray({
        control,
        name: 'academicRecord',
    });

    const {
        fields: attendanceFields,
        append: appendAttendance,
        remove: removeAttendance
    } = useFieldArray({
        control,
        name: 'attendance',
    });

    const handleSimceScoreChange = (e, onChange) => {
        const value = e.target.value;
        if (value === '') {
            onChange(null);
            return;
        }
        const numValue = Number(value);
        if (numValue >= SIMCE_MIN_SCORE && numValue <= SIMCE_MAX_SCORE) {
            onChange(numValue);
        }
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>Resultados SIMCE</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Ingrese los puntajes obtenidos en las pruebas SIMCE (0-1000 puntos)
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="simceResults.Lenguaje"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Lenguaje"
                                type="number"
                                fullWidth
                                inputProps={{ min: SIMCE_MIN_SCORE, max: SIMCE_MAX_SCORE }}
                                error={!!errors?.simceResults?.Lenguaje}
                                helperText={errors?.simceResults?.Lenguaje?.message}
                                onChange={(e) => handleSimceScoreChange(e, field.onChange)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="simceResults.matematica"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Matemática"
                                type="number"
                                fullWidth
                                inputProps={{ min: SIMCE_MIN_SCORE, max: SIMCE_MAX_SCORE }}
                                error={!!errors?.simceResults?.matematica}
                                helperText={errors?.simceResults?.matematica?.message}
                                onChange={(e) => handleSimceScoreChange(e, field.onChange)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="simceResults.cienciasNaturales"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Ciencias Naturales"
                                type="number"
                                fullWidth
                                inputProps={{ min: SIMCE_MIN_SCORE, max: SIMCE_MAX_SCORE }}
                                error={!!errors?.simceResults?.cienciasNaturales}
                                helperText={errors?.simceResults?.cienciasNaturales?.message}
                                onChange={(e) => handleSimceScoreChange(e, field.onChange)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="simceResults.historiayGeografia"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Historia, Geografía y Ciencias Sociales"
                                type="number"
                                fullWidth
                                inputProps={{ min: SIMCE_MIN_SCORE, max: SIMCE_MAX_SCORE }}
                                error={!!errors?.simceResults?.historiayGeografia}
                                helperText={errors?.simceResults?.historiayGeografia?.message}
                                onChange={(e) => handleSimceScoreChange(e, field.onChange)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="simceResults.ingles"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Inglés"
                                type="number"
                                fullWidth
                                inputProps={{ min: SIMCE_MIN_SCORE, max: SIMCE_MAX_SCORE }}
                                error={!!errors?.simceResults?.ingles}
                                helperText={errors?.simceResults?.ingles?.message}
                                onChange={(e) => handleSimceScoreChange(e, field.onChange)}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>Historial Académico</Typography>
            {academicFields.map((item, index) => (
                <Grid container spacing={3} key={item.id}>
                    <Grid item xs={12} md={5}>
                        <Controller
                            name={`academicRecord.${index}.subject`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Asignatura"
                                    fullWidth
                                    error={!!errors?.academicRecord?.[index]?.subject}
                                    helperText={errors?.academicRecord?.[index]?.subject?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Controller
                            name={`academicRecord.${index}.score`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nota"
                                    type="number"
                                    fullWidth
                                    inputProps={{ min: 1.0, max: 7.0, step: 0.1 }}
                                    error={!!errors?.academicRecord?.[index]?.score}
                                    helperText={errors?.academicRecord?.[index]?.score?.message}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <IconButton
                            onClick={() => removeAcademic(index)}
                            color="error"
                            sx={{ mt: 1 }}
                        >
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => appendAcademic({ subject: '', score: '' })}
                sx={{ mt: 2, mb: 4 }}
            >
                Agregar Asignatura
            </Button>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>Asistencia</Typography>
            {attendanceFields.map((item, index) => (
                <Grid container spacing={3} key={item.id}>
                    <Grid item xs={12} md={5}>
                        <Controller
                            name={`attendance.${index}.date`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Fecha"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.attendance?.[index]?.date}
                                    helperText={errors?.attendance?.[index]?.date?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Controller
                            name={`attendance.${index}.status`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Estado"
                                    fullWidth
                                    error={!!errors?.attendance?.[index]?.status}
                                    helperText={errors?.attendance?.[index]?.status?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <IconButton
                            onClick={() => removeAttendance(index)}
                            color="error"
                            sx={{ mt: 1 }}
                        >
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => appendAttendance({ date: '', status: '' })}
                sx={{ mt: 2 }}
            >
                Agregar Registro de Asistencia
            </Button>
        </>
    );
}