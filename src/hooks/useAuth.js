// hooks/useAuth.js
import { create } from 'zustand'
import { authApi } from '@/lib/api/auth'
import { axiosPrivate } from '@/lib/api/axios'

const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,

    // Método de login
    login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
            const response = await authApi.login(credentials)
            console.log('Respuesta de login:', response)

            const { token, user } = response.data
            if (!user || !token) {
                throw new Error('Respuesta inesperada de la API')
            }

            // Asegurarse de que todos los campos necesarios estén presentes
            const userInfo = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                staffType: user.staffType,
                department: user.department
            }

            // Guardar en sessionStorage con toda la información
            sessionStorage.setItem('auth', JSON.stringify({
                user: userInfo,
                accessToken: token
            }))

            // Configurar el token en axios
            axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${token}`

            // Actualizar el estado con toda la información
            set({
                user: userInfo,
                accessToken: token,
                isLoading: false
            })

            return response
        } catch (error) {
            console.error('Error en login:', error)
            set({
                error: error.response?.data?.message || 'Error al iniciar sesión',
                isLoading: false
            })
            throw error
        }
    },

    // Método de logout
    logout: async () => {
        const state = get()
        try {
            if (state.user) {
                console.log('Iniciando logout')
                await authApi.logout()
                console.log('Logout exitoso en el servidor')
            }
        } catch (error) {
            console.error('Error en logout:', error)
        } finally {
            console.log('Limpiando sesión local')
            // Limpiar localStorage/sessionStorage
            sessionStorage.removeItem('auth')
            // Limpiar headers de axios
            delete axiosPrivate.defaults.headers.common['Authorization']
            // Limpiar estado
            set({
                user: null,
                accessToken: null,
                error: null
            })
            // Redirigir al login
            window.location.href = '/login'
        }
    },

    // Método para refrescar la sesión
    refreshSession: async () => {
        try {
            const { refreshToken } = get()
            if (!refreshToken) throw new Error('No refresh token available')

            const response = await authApi.refreshToken(refreshToken)
            const { tokens } = response.data

            // Actualizamos el token en axios
            axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`

            // Actualizamos sessionStorage
            const currentAuth = JSON.parse(sessionStorage.getItem('auth') || '{}')
            sessionStorage.setItem('auth', JSON.stringify({
                ...currentAuth,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            }))

            set({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            })
            return tokens
        } catch (error) {
            console.error('Error en refresh session:', error)
            sessionStorage.removeItem('auth')
            delete axiosPrivate.defaults.headers.common['Authorization']
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                error: 'Sesión expirada'
            })
            throw error
        }
    },

    // Método para verificar permisos
    checkPermission: (entity, operation) => {
        const { user } = get()
        if (!user) return false

        const role = user.role

        switch (role) {
            case 'Admin':
                return true

            case 'User':
                return operation !== 'delete'

            case 'Viewer':
                switch (entity) {
                    case 'student':
                        return operation === 'read'
                    case 'intervention':
                    case 'comment':
                        return ['read', 'create', 'update'].includes(operation)
                    default:
                        return false
                }

            default:
                return false
        }
    },

    // Método para inicializar la autenticación
    initializeAuth: () => {
        const storedAuth = sessionStorage.getItem('auth')
        if (storedAuth) {
            try {
                const { user, accessToken } = JSON.parse(storedAuth)
                
                // Verificar que todos los campos necesarios estén presentes
                if (user && user.id && user.email && accessToken) {
                    // Configurar el token en axios
                    axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                    
                    // Actualizar el estado
                    set({
                        user,
                        accessToken,
                        isLoading: false
                    })
                    return true
                }
            } catch (error) {
                console.error('Error al inicializar auth:', error)
                sessionStorage.removeItem('auth')
            }
        }
        return false
    }
}))

export default useAuthStore