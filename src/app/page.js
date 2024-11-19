// src/app/page.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, CircularProgress } from '@mui/material'
import useAuthStore from '@/hooks/useAuth'

export default function Home() {
    const router = useRouter()
    const { user, initializeAuth } = useAuthStore()

    useEffect(() => {
        console.log('Home: Verificando autenticación')
        const hasSession = initializeAuth()
        console.log('Home: Estado de sesión:', { hasSession, user })

        if (user) {
            console.log('Home: Redirigiendo a dashboard')
            router.push('/dashboard')
        } else {
            console.log('Home: Redirigiendo a login')
            router.push('/login')
        }
    }, [router, user])

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