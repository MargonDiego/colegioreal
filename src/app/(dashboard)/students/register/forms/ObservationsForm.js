import React from 'react';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { Grid, TextField, IconButton, Typography, Button, Divider } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export default function ObservationsForm() {
    const { control, formState: { errors } } = useFormContext();

    const {
        fields: recognitionFields,
        append: appendRecognition,
        remove: removeRecognition
    } = useFieldArray({
        control,
        name: 'reconocimientos',
    });

    const {
        fields: disciplinaryFields,
        append: appendDisciplinary,
        remove: removeDisciplinary
    } = useFieldArray({
        control,
        name: 'medidasDisciplinarias',
    });

    return (
        <>
            <Typography variant="h6" gutterBottom>Observaciones Generales</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="observaciones"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Observaciones"
                                fullWidth
                                multiline
                                rows={4}
                                error={!!errors?.observaciones}
                                helperText={errors?.observaciones?.message || "Ingrese observaciones generales sobre el estudiante"}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>Reconocimientos</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Registre los logros y reconocimientos obtenidos por el estudiante
            </Typography>
            {recognitionFields.map((item, index) => (
                <Grid container spacing={3} key={item.id}>
                    <Grid item xs={12} md={5}>
                        <Controller
                            name={`reconocimientos.${index}.date`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Fecha"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.reconocimientos?.[index]?.date}
                                    helperText={errors?.reconocimientos?.[index]?.date?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name={`reconocimientos.${index}.achievement`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Logro"
                                    fullWidth
                                    multiline
                                    error={!!errors?.reconocimientos?.[index]?.achievement}
                                    helperText={errors?.reconocimientos?.[index]?.achievement?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <IconButton
                            onClick={() => removeRecognition(index)}
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
                onClick={() => appendRecognition({ date: '', achievement: '' })}
                sx={{ mt: 2 }}
            >
                Agregar Reconocimiento
            </Button>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>Medidas Disciplinarias</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Registre las medidas disciplinarias aplicadas
            </Typography>
            {disciplinaryFields.map((item, index) => (
                <Grid container spacing={3} key={item.id}>
                    <Grid item xs={12} md={5}>
                        <Controller
                            name={`medidasDisciplinarias.${index}.date`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Fecha"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.medidasDisciplinarias?.[index]?.date}
                                    helperText={errors?.medidasDisciplinarias?.[index]?.date?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name={`medidasDisciplinarias.${index}.description`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Descripción"
                                    fullWidth
                                    multiline
                                    error={!!errors?.medidasDisciplinarias?.[index]?.description}
                                    helperText={errors?.medidasDisciplinarias?.[index]?.description?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <IconButton
                            onClick={() => removeDisciplinary(index)}
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
                onClick={() => appendDisciplinary({ date: '', description: '' })}
                sx={{ mt: 2 }}
            >
                Agregar Medida Disciplinaria
            </Button>
            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>Registro de Convivencia</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="registroConvivencia"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Registro de Convivencia"
                                fullWidth
                                multiline
                                rows={4}
                                error={!!errors.registroConvivencia}
                                helperText={errors.registroConvivencia?.message || "Ingrese información del registro de convivencia"}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </>
    );
}