import React from 'react';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { Grid, TextField, IconButton, Typography, Button, Box, InputAdornment } from '@mui/material';
import { User, Phone, Heart, Plus, Trash2 } from 'lucide-react';

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

export default function EmergencyContactsForm() {
    const { control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'contactosEmergencia',
    });

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
                Contactos de Emergencia
            </Typography>
            
            {fields.map((item, index) => (
                <Grid container spacing={3} key={item.id} sx={{ mb: 2 }}>
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
                                    placeholder="+56 9 1234 5678"
                                    error={!!errors?.contactosEmergencia?.[index]?.phone}
                                    helperText={errors?.contactosEmergencia?.[index]?.phone?.message}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Heart size={20} />
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
                            onClick={() => remove(index)}
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
                onClick={() => append({ name: '', phone: '', relationship: '' })}
                sx={{ 
                    mt: 2,
                    '&:hover': {
                        backgroundColor: 'primary.lighter',
                    }
                }}
            >
                Agregar Contacto de Emergencia
            </Button>
        </Box>
    );
}