'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import useAuthStore from '@/hooks/useAuth' // Importar el hook de autenticación

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const { login } = useAuthStore() // Extraer la función login desde el hook

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            console.log('Intentando login con:', data) // Log inicial del intento de login
            const response = await login(data)
            console.log('Respuesta después del login:', response) // Log de la respuesta del login

            // Verificamos que el usuario y rol existan
            if (response?.data?.user?.role) {
                console.log('Usuario autenticado:', response.data.user) // Log del usuario autenticado
                enqueueSnackbar('Login exitoso', { variant: 'success' })
                router.push('/dashboard')
            } else {
                console.error('Rol no encontrado en la respuesta del usuario') // Log de error si falta el rol
                enqueueSnackbar('Error: Rol del usuario no encontrado', { variant: 'error' })
            }
        } catch (error) {
            console.error('Error en login:', error) // Log de error
            enqueueSnackbar(
                error.response?.data?.message || 'Error al iniciar sesión',
                { variant: 'error' }
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
                Iniciar Sesión
            </Typography>

            <Box sx={{ mt: 3 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    autoComplete="email"
                    autoFocus
                    {...register('email', {
                        required: 'El correo electrónico es requerido',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Correo electrónico inválido'
                        }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    {...register('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                            value: 6,
                            message: 'La contraseña debe tener al menos 6 caracteres'
                        }
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Iniciar Sesión'
                    )}
                </Button>
            </Box>
        </Box>
    )
}
