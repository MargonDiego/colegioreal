import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField, Typography, Box, InputAdornment, Divider } from '@mui/material';
import { User, Phone, Mail, Flag, MapPin } from 'lucide-react';

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

const GuardianSection = ({ prefix, title, required = false }) => {
    const { control, formState: { errors } } = useFormContext();
    
    return (
        <>
            <Typography 
                variant="subtitle1" 
                sx={{ 
                    mb: 2,
                    color: 'text.primary',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <User size={20} />
                {title}
                {required && (
                    <Typography 
                        component="span" 
                        sx={{ 
                            color: 'error.main',
                            ml: 0.5,
                            fontSize: '0.75rem'
                        }}
                    >
                        *
                    </Typography>
                )}
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Controller
                        name={`${prefix}.name`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nombre Completo"
                                fullWidth
                                required={required}
                                error={!!errors[prefix]?.name}
                                helperText={errors[prefix]?.name?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        name={`${prefix}.rut`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="RUT"
                                fullWidth
                                required={required}
                                error={!!errors[prefix]?.rut}
                                helperText={errors[prefix]?.rut?.message}
                                placeholder="12.345.678-9"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Flag size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        name={`${prefix}.phone`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Teléfono"
                                fullWidth
                                required={required}
                                error={!!errors[prefix]?.phone}
                                helperText={errors[prefix]?.phone?.message}
                                placeholder="+56 9 1234 5678"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        name={`${prefix}.email`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Correo Electrónico"
                                fullWidth
                                required={required}
                                error={!!errors[prefix]?.email}
                                helperText={errors[prefix]?.email?.message}
                                type="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail size={20} />
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
                        name={`${prefix}.address`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Dirección"
                                fullWidth
                                error={!!errors[prefix]?.address}
                                helperText={errors[prefix]?.address?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MapPin size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default function GuardianInfoForm() {
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
                Información de Apoderados
            </Typography>

            <GuardianSection 
                prefix="apoderadoTitular" 
                title="Apoderado Titular" 
                required={true} 
            />

            <Divider sx={{ my: 4 }} />

            <GuardianSection 
                prefix="apoderadoSuplente" 
                title="Apoderado Suplente" 
            />

            <Grid item xs={12}>
                <Controller
                    name="grupoFamiliar"
                    control={control}
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
        </Box>
    );
}