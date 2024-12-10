import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField, MenuItem, Typography, Box, InputAdornment } from '@mui/material';
import { Droplets, Heart, Pill, AlertCircle } from 'lucide-react';

const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const previsionOptions = ['Fonasa', 'Isapre', 'Particular', 'Otro'];

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: 'primary.main',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'primary.main',
    },
};

export default function HealthInfoForm() {
    const { control, formState: { errors } } = useFormContext();

    return (
        <Box>
            <Typography 
                variant="h6" 
                sx={{ 
                    mb: 3,
                    color: 'text.primary',
                    fontWeight: 500
                }}
            >
                Información de Salud
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="grupoSanguineo"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Grupo Sanguíneo"
                                fullWidth
                                error={!!errors?.grupoSanguineo}
                                helperText={errors?.grupoSanguineo?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Droplets size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            >
                                {bloodTypeOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        name="prevision"
                        control={control}
                        defaultValue="Fonasa"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Previsión de Salud"
                                fullWidth
                                error={!!errors.prevision}
                                helperText={errors.prevision?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Heart size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            >
                                {previsionOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="condicionesMedicas"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Condiciones Médicas"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors?.condicionesMedicas}
                                helperText={errors?.condicionesMedicas?.message || "Ingrese las condiciones médicas separadas por comas"}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? value.split(',').map(item => item.trim()) : []);
                                }}
                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AlertCircle size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="alergias"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Alergias"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors?.alergias}
                                helperText={errors?.alergias?.message || "Ingrese las alergias separadas por comas"}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? value.split(',').map(item => item.trim()) : []);
                                }}
                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AlertCircle size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="medicamentos"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Medicamentos"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors?.medicamentos}
                                helperText={errors?.medicamentos?.message || "Ingrese los medicamentos separados por comas"}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? value.split(',').map(item => item.trim()) : []);
                                }}
                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Pill size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="diagnosticoPIE"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Diagnóstico PIE"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors.diagnosticoPIE}
                                helperText={errors.diagnosticoPIE?.message || "Ingrese detalles del diagnóstico PIE"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AlertCircle size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="necesidadesEducativas"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Necesidades Educativas"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors.necesidadesEducativas}
                                helperText={errors.necesidadesEducativas?.message || "Ingrese las necesidades educativas"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AlertCircle size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="apoyosPIE"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Apoyos PIE"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors.apoyosPIE}
                                helperText={errors.apoyosPIE?.message || "Ingrese detalles de los apoyos PIE"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AlertCircle size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}