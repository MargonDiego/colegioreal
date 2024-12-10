// hooks/useAxiosPrivate.js
import { useEffect, useRef } from 'react'
import { axiosPrivate } from '@/lib/api/axios'
import useAuthStore from './useAuth'
import { useRouter } from 'next/navigation'

const useAxiosPrivate = () => {
    const router = useRouter()
    const { accessToken, refreshToken, logout } = useAuthStore()
    const isRefreshing = useRef(false) // Prevenir múltiples refreshes simultáneos

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization'] && accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`
                }
                return config
            },
            error => Promise.reject(error)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config

                if (error?.response?.status === 401 && !prevRequest?.sent && refreshToken) {
                    prevRequest.sent = true

                    try {
                        if (!isRefreshing.current) {
                            isRefreshing.current = true
                            await useAuthStore.getState().refreshSession()
                            isRefreshing.current = false

                            // Actualizar el token en la solicitud original
                            const newAccessToken = useAuthStore.getState().accessToken
                            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                            return axiosPrivate(prevRequest)
                        }
                    } catch (refreshError) {
                        isRefreshing.current = false
                        await logout()
                        router.replace('/login')
                        return Promise.reject(refreshError)
                    }
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }
    }, [accessToken, refreshToken, logout, router])

    return axiosPrivate
}

export default useAxiosPrivate