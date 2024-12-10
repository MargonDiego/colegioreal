import React from 'react';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { Grid, TextField, IconButton, Typography, Button, Box, Divider, InputAdornment } from '@mui/material';
import { FileText, Calendar, Award, AlertTriangle, Plus, Trash2 } from 'lucide-react';

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
        <Box>
            <Typography 
                variant="h6" 
                sx={{ 
                    mb: 3,
                    color: 'text.primary',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <FileText size={24} />
                Observaciones Generales
            </Typography>

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
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography 
                variant="h6" 
                sx={{ 
                    mb: 2,
                    color: 'text.primary',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Award size={24} />
                Reconocimientos
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Registre los logros y reconocimientos obtenidos por el estudiante
            </Typography>

            {recognitionFields.map((item, index) => (
                <Grid container spacing={3} key={item.id} sx={{ mb: 2 }}>
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Award size={20} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={textFieldStyles}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <IconButton
                            onClick={() => removeRecognition(index)}
                            color="error"
                            sx={{ 
                                mt: 1,
                                '&:hover': {
                                    backgroundColor: 'error.lighter',
                                }
                            }}
                        >
                            <Trash2 size={20} />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Button
                variant="outlined"
                startIcon={<Plus size={20} />}
                onClick={() => appendRecognition({ date: '', achievement: '' })}
                sx={{ 
                    mt: 2,
                    mb: 4,
                    '&:hover': {
                        backgroundColor: 'primary.lighter',
                    }
                }}
            >
                Agregar Reconocimiento
            </Button>

            <Divider sx={{ my: 4 }} />

            <Typography 
                variant="h6" 
                sx={{ 
                    mb: 2,
                    color: 'text.primary',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <AlertTriangle size={24} />
                Medidas Disciplinarias
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Registre las medidas disciplinarias aplicadas
            </Typography>

            {disciplinaryFields.map((item, index) => (
                <Grid container spacing={3} key={item.id} sx={{ mb: 2 }}>
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
                            name={`medidasDisciplinarias.${index}.measure`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Medida"
                                    fullWidth
                                    multiline
                                    error={!!errors?.medidasDisciplinarias?.[index]?.measure}
                                    helperText={errors?.medidasDisciplinarias?.[index]?.measure?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AlertTriangle size={20} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={textFieldStyles}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <IconButton
                            onClick={() => removeDisciplinary(index)}
                            color="error"
                            sx={{ 
                                mt: 1,
                                '&:hover': {
                                    backgroundColor: 'error.lighter',
                                }
                            }}
                        >
                            <Trash2 size={20} />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Button
                variant="outlined"
                startIcon={<Plus size={20} />}
                onClick={() => appendDisciplinary({ date: '', measure: '' })}
                sx={{ 
                    mt: 2,
                    '&:hover': {
                        backgroundColor: 'primary.lighter',
                    }
                }}
            >
                Agregar Medida Disciplinaria
            </Button>
            <Divider sx={{ my: 4 }} />

            <Typography 
                variant="h6" 
                sx={{ 
                    mb: 2,
                    color: 'text.primary',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <FileText size={24} />
                Registro de Convivencia
            </Typography>
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
            </Grid>
        </Box>
    );
}