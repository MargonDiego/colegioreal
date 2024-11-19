import React from 'react';
import { Controller,useFormContext } from 'react-hook-form';
import { Grid, TextField, MenuItem } from '@mui/material';


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
];

const regionOptions = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
    'Coquimbo', 'Valparaíso', 'Metropolitana', 'O\'Higgins',
    'Maule', 'Ñuble', 'Biobío', 'Araucanía', 'Los Ríos',
    'Los Lagos', 'Aysén del General Carlos Ibáñez del Campo',
    'Magallanes y de la Antártica Chilena'
];

export default function PersonalInfoForm() {
    const { control, formState: { errors }, watch } = useFormContext();
    const firstName = watch('firstName');

    return (
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
                            label="Apellido"
                            fullWidth
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
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
                            placeholder="12345678-9"
                            error={!!errors.rut}
                            helperText={errors.rut?.message}
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
                            label="Email"
                            type="email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Fecha de Nacimiento"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate?.message}
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
            <Grid item xs={12} md={6}>
                <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Región"
                            required
                            fullWidth
                            error={!!errors.region}
                            helperText={errors.region?.message}
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
                            required
                            fullWidth
                            error={!!errors.comuna}
                            helperText={errors.comuna?.message}
                        />
                    )}
                />
            </Grid>

            {/* Campo de dirección opcional */}
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
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="isActive"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Estado Activo"
                            select
                            fullWidth
                            error={!!errors.isActive}
                            helperText={errors.isActive?.message}
                        >
                            <MenuItem value={true}>Activo</MenuItem>
                            <MenuItem value={false}>Inactivo</MenuItem>
                        </TextField>
                    )}
                />
            </Grid>
        </Grid>
    );
}