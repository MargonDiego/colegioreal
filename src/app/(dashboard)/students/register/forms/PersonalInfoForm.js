import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField, MenuItem, Typography, Box, InputAdornment } from '@mui/material';
import { User, Mail, MapPin, Calendar, Flag, Users } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers';

const genderOptions = ['Masculino', 'Femenino', 'No Binario', 'Otro'];
const nationalityOptions = [
    'Chilena',
    'Argentina', 'Boliviana', 'Brasileña', 'Colombiana', 'Peruana', 'Venezolana', 'Paraguaya', 'Uruguaya', 'Ecuatoriana',
    'Española', 'Italiana', 'Alemana', 'Francesa', 'Británica', 'Holandesa', 'Belga', 'Suiza', 'Sueca', 'Noruega',
    'Danesa', 'Portuguesa', 'Austriaca',
    'Estadounidense', 'Canadiense', 'Mexicana', 'Cubana', 'Guatemalteca', 'Costarricense', 'Panameña',
    'Japonesa', 'China', 'India', 'Coreana', 'Filipina', 'Vietnamita', 'Tailandesa', 'Indonesia', 'Malasia',
    'Singapurense', 'Taiwanesa',
    'Sudafricana', 'Nigeriana', 'Keniana', 'Egipcia', 'Marroquí', 'Ghanesa', 'Etiopía',
    'Australiana', 'Neozelandesa',
    'Otra'
].sort();

const regionOptions = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
    'Coquimbo', 'Valparaíso', 'Metropolitana', 'O\'Higgins',
    'Maule', 'Ñuble', 'Biobío', 'Araucanía', 'Los Ríos',
    'Los Lagos', 'Aysén del General Carlos Ibáñez del Campo',
    'Magallanes y de la Antártica Chilena'
];

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

export default function PersonalInfoForm() {
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
                Información Personal del Estudiante
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nombre"
                                fullWidth
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
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
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Apellidos"
                                fullWidth
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
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
                        name="rut"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="RUT"
                                fullWidth
                                error={!!errors.rut}
                                helperText={errors.rut?.message}
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
                        name="birthDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                label="Fecha de Nacimiento"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.birthDate,
                                        helperText: errors.birthDate?.message,
                                        InputProps: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Calendar size={20} />
                                                </InputAdornment>
                                            ),
                                        },
                                        sx: textFieldStyles
                                    }
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Género"
                                fullWidth
                                error={!!errors.gender}
                                helperText={errors.gender?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Users size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            >
                                {genderOptions.map((option) => (
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
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Nacionalidad"
                                fullWidth
                                error={!!errors.nationality}
                                helperText={errors.nationality?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Flag size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            >
                                {nationalityOptions.map((option) => (
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
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Dirección"
                                fullWidth
                                error={!!errors.address}
                                helperText={errors.address?.message}
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

                <Grid item xs={12} md={6}>
                    <Controller
                        name="region"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Región"
                                fullWidth
                                error={!!errors.region}
                                helperText={errors.region?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MapPin size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            >
                                {regionOptions.map((option) => (
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
                        name="comuna"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Comuna"
                                fullWidth
                                error={!!errors.comuna}
                                helperText={errors.comuna?.message}
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

                <Grid item xs={12} md={6}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Correo Electrónico"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}
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
            </Grid>
        </Box>
    );
}