// lib/api/auth.js
import { axiosPublic, axiosPrivate } from './axios'

export const authApi = {
    login: async (credentials) => {
        try {
            console.log('Intentando login con:', credentials)
            const response = await axiosPublic.post('/auth/login', credentials)
            console.log('Respuesta de login:', response.data)
            return response
        } catch (error) {
            console.error('Error en login:', error)
            throw error
        }
    },

        logout: async () => {
            try {
                console.log('Enviando petición de logout al servidor')
                const response = await axiosPrivate.post('/auth/logout', {
                    module: 'AUTH',
                    action: 'LOGOUT',
                    // El token JWT ya va en el header, no necesitamos enviarlo en el body
                })
                console.log('Respuesta del servidor logout:', response.data)
                return response
            } catch (error) {
                console.error('Error en logout:', error)
                throw error
            }
        },


    refresh: async () => {
        try {
            const response = await axiosPrivate.post('/auth/refresh')
            return response
        } catch (error) {
            console.error('Error en refresh:', error)
            throw error
        }
    }
}