// components/auth/ProtectedRoute.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/hooks/useAuth'
import { CircularProgress, Box } from '@mui/material'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const router = useRouter()
    const { user, isLoading, initializeAuth } = useAuthStore()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            console.log('Estado inicial:', { user, isChecking })

            if (!user) {
                const hasSession = initializeAuth()
                console.log('Sesión recuperada:', { hasSession })

                // Esperamos un momento para que se actualice el estado
                await new Promise(resolve => setTimeout(resolve, 100))

                // Verificamos nuevamente el usuario después de inicializar
                const currentUser = useAuthStore.getState().user
                console.log('Usuario después de inicializar:', currentUser)

                if (!currentUser) {
                    console.log('No hay usuario, redirigiendo a login')
                    router.push('/login')
                }
            }

            setIsChecking(false)
        }

        checkAuth()
    }, [user, router, initializeAuth])

    useEffect(() => {
        if (!isChecking && user && allowedRoles.length > 0) {
            if (!allowedRoles.includes(user.role)) {
                console.log('Usuario sin permisos:', { role: user.role, allowedRoles })
                router.push('/unauthorized')
            }
        }
    }, [user, isChecking, allowedRoles, router])

    if (isChecking || isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        )
    }

    if (!user) {
        return null
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return null
    }

    return children
}

export default ProtectedRoute