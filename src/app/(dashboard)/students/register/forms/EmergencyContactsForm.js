import React from 'react';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { Grid, TextField, IconButton, Typography, Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export default function EmergencyContactsForm() {
    const { control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'contactosEmergencia',
    });

    return (
        <>
            <Typography variant="h6" gutterBottom>Contactos de Emergencia</Typography>
            {fields.map((item, index) => (
                <Grid container spacing={3} key={item.id}>
                    <Grid item xs={12} md={4}>
                        <Controller
                            name={`contactosEmergencia.${index}.name`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre del Contacto"
                                    fullWidth
                                    error={!!errors?.contactosEmergencia?.[index]?.name}
                                    helperText={errors?.contactosEmergencia?.[index]?.name?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Controller
                            name={`contactosEmergencia.${index}.phone`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Teléfono del Contacto"
                                    fullWidth
                                    error={!!errors?.contactosEmergencia?.[index]?.phone}
                                    helperText={errors?.contactosEmergencia?.[index]?.phone?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Controller
                            name={`contactosEmergencia.${index}.relationship`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Relación"
                                    fullWidth
                                    error={!!errors?.contactosEmergencia?.[index]?.relationship}
                                    helperText={errors?.contactosEmergencia?.[index]?.relationship?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <IconButton
                            onClick={() => remove(index)}
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
                onClick={() => append({ name: '', phone: '', relationship: '' })}
                sx={{ mt: 2 }}
            >
                Agregar Contacto
            </Button>
        </>
    );
}