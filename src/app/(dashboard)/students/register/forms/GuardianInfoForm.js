import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField, Typography } from '@mui/material';

export default function GuardianInfoForm() {
    const { control, formState: { errors } } = useFormContext();

    return (
        <>
            <Typography variant="h6" gutterBottom>Apoderado Titular</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="apoderadoTitular.name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nombre del Apoderado Titular"
                                fullWidth
                                error={!!errors.apoderadoTitular?.name}
                                helperText={errors.apoderadoTitular?.name?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="apoderadoTitular.rut"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="RUT del Apoderado Titular"
                                fullWidth
                                error={!!errors.apoderadoTitular?.rut}
                                helperText={errors.apoderadoTitular?.rut?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="apoderadoTitular.phone"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Teléfono del Apoderado Titular"
                                fullWidth
                                error={!!errors.apoderadoTitular?.phone}
                                helperText={errors.apoderadoTitular?.phone?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="apoderadoTitular.email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email del Apoderado Titular"
                                type="email"
                                fullWidth
                                error={!!errors.apoderadoTitular?.email}
                                helperText={errors.apoderadoTitular?.email?.message}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Apoderado Suplente</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="apoderadoSuplente.name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nombre del Apoderado Suplente"
                                fullWidth
                                error={!!errors.apoderadoSuplente?.name}
                                helperText={errors.apoderadoSuplente?.name?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="apoderadoSuplente.rut"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="RUT del Apoderado Suplente"
                                fullWidth
                                error={!!errors.apoderadoSuplente?.rut}
                                helperText={errors.apoderadoSuplente?.rut?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="apoderadoSuplente.phone"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Teléfono del Apoderado Suplente"
                                fullWidth
                                error={!!errors.apoderadoSuplente?.phone}
                                helperText={errors.apoderadoSuplente?.phone?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="apoderadoSuplente.email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email del Apoderado Suplente"
                                type="email"
                                fullWidth
                                error={!!errors.apoderadoSuplente?.email}
                                helperText={errors.apoderadoSuplente?.email?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="grupoFamiliar"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Grupo Familiar"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors.grupoFamiliar}
                                helperText={errors.grupoFamiliar?.message || "Ingrese detalles del grupo familiar"}
                            />
                        )}
                    />
                </Grid>

            </Grid>
        </>
    );
}