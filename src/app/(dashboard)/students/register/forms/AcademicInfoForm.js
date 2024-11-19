import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField, MenuItem } from '@mui/material';

const gradeOptions = [
    'Pre-Kinder', 'Kinder',
    '1° Básico', '2° Básico', '3° Básico', '4° Básico',
    '5° Básico', '6° Básico', '7° Básico', '8° Básico',
    '1° Medio', '2° Medio', '3° Medio', '4° Medio'
];

const enrollmentStatusOptions = [
    'Regular', 'Suspendido', 'Retirado', 'Egresado', 'Trasladado'
];
const beneficiosJUNAEB = [
    'Beca Presidente de la República',
    'Beca Indígena',
    'Beca Integración Territorial',
    'Beca PSU',
    'Beca de Mantención',
    'Tarjeta Nacional Estudiantil (TNE)',
    'Programa de Alimentación Escolar (PAE)',
    'Programa de Alimentación de Párvulos (PAP)',
    'Residencia Familiar Estudiantil',
    'Residencia Estudiantil',
    'Otros'
];

export default function AcademicInfoForm() {
    const { control, formState: { errors } } = useFormContext();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Controller
                    name="grade"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Grado"
                            fullWidth
                            error={!!errors.grade}
                            helperText={errors.grade?.message}
                        >
                            {gradeOptions.map((option) => (
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
                    name="academicYear"
                    control={control}
                    defaultValue={new Date().getFullYear()}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Año Académico"
                            type="number"
                            fullWidth
                            error={!!errors.academicYear}
                            helperText={errors.academicYear?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="section"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Sección"
                            fullWidth
                            error={!!errors.section}
                            helperText={errors.section?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="matriculaNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Número de Matrícula"
                            fullWidth
                            error={!!errors.matriculaNumber}
                            helperText={errors.matriculaNumber?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="enrollmentStatus"
                    control={control}
                    defaultValue="Regular"
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Estado de Matrícula"
                            fullWidth
                            error={!!errors.enrollmentStatus}
                            helperText={errors.enrollmentStatus?.message}
                        >
                            {enrollmentStatusOptions.map((option) => (
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
                    name="previousSchool"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Colegio Anterior"
                            fullWidth
                            error={!!errors.previousSchool}
                            helperText={errors.previousSchool?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="tipoBeneficioJUNAEB"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.tipoBeneficioJUNAEB}>
                            <InputLabel id="beneficio-junaeb-label">Tipo de Beneficio JUNAEB</InputLabel>
                            <Select
                                {...field}
                                labelId="beneficio-junaeb-label"
                                multiple
                                renderValue={(selected) => (
                                    <div>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </div>
                                )}
                            >
                                {beneficiosJUNAEB.map((beneficio) => (
                                    <MenuItem key={beneficio} value={beneficio}>
                                        {beneficio}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.tipoBeneficioJUNAEB && (
                                <Typography color="error" variant="body2">
                                    {errors.tipoBeneficioJUNAEB.message}
                                </Typography>
                            )}
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="prioritario"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="¿Estudiante Prioritario?"
                            select
                            fullWidth
                            error={!!errors.prioritario}
                            helperText={errors.prioritario?.message}
                        >
                            <MenuItem value={true}>Sí</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </TextField>
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="preferente"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="¿Estudiante Preferente?"
                            select
                            fullWidth
                            error={!!errors.preferente}
                            helperText={errors.preferente?.message}
                        >
                            <MenuItem value={true}>Sí</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </TextField>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="becas"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Becas"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors.becas}
                            helperText={errors.becas?.message || "Ingrese detalles de las becas"}
                        />
                    )}
                />
            </Grid>

        </Grid>
    );
}