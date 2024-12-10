import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { 
    Grid, 
    TextField, 
    MenuItem, 
    Typography, 
    Box, 
    InputAdornment, 
    Checkbox, 
    FormControlLabel, 
    FormGroup,
    Select,
    Chip,
    OutlinedInput
} from '@mui/material';
import { GraduationCap, School, Calendar, FileText, Award, Book, UserCheck } from 'lucide-react';

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
].sort();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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

export default function AcademicInfoForm() {
    const { control, formState: { errors }, watch } = useFormContext();
    const beneficioJUNAEB = watch('beneficioJUNAEB');

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
                Información Académica
            </Typography>

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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <GraduationCap size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
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
                                fullWidth
                                type="number"
                                error={!!errors.academicYear}
                                helperText={errors.academicYear?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Calendar size={20} />
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
                        name="matriculaNumber"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Número de Matrícula"
                                fullWidth
                                error={!!errors.matriculaNumber}
                                helperText={errors.matriculaNumber?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FileText size={20} />
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <UserCheck size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
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
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Colegio Anterior"
                                fullWidth
                                error={!!errors.previousSchool}
                                helperText={errors.previousSchool?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <School size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            mt: 2, 
                            mb: 2,
                            color: 'text.primary',
                            fontWeight: 500
                        }}
                    >
                        Beneficios y Características
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormGroup>
                        <Controller
                            name="beneficioJUNAEB"
                            control={control}
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={value}
                                            onChange={onChange}
                                            {...field}
                                        />
                                    }
                                    label="Beneficio JUNAEB"
                                />
                            )}
                        />
                    </FormGroup>
                </Grid>

                {beneficioJUNAEB && (
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="tipoBeneficioJUNAEB"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    multiple
                                    label="Tipos de Beneficios JUNAEB"
                                    fullWidth
                                    error={!!errors.tipoBeneficioJUNAEB}
                                    input={
                                        <OutlinedInput 
                                            label="Tipos de Beneficios JUNAEB"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Award size={20} />
                                                </InputAdornment>
                                            }
                                        />
                                    }
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                    sx={textFieldStyles}
                                >
                                    {beneficiosJUNAEB.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.tipoBeneficioJUNAEB && (
                            <Typography variant="caption" color="error">
                                {errors.tipoBeneficioJUNAEB.message}
                            </Typography>
                        )}
                    </Grid>
                )}

                <Grid item xs={12} md={6}>
                    <FormGroup>
                        <Controller
                            name="prioritario"
                            control={control}
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={value}
                                            onChange={onChange}
                                            {...field}
                                        />
                                    }
                                    label="Alumno Prioritario"
                                />
                            )}
                        />
                    </FormGroup>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormGroup>
                        <Controller
                            name="preferente"
                            control={control}
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={value}
                                            onChange={onChange}
                                            {...field}
                                        />
                                    }
                                    label="Alumno Preferente"
                                />
                            )}
                        />
                    </FormGroup>
                </Grid>
            </Grid>
        </Box>
    );
}