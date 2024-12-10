'use client'

import { useState, useEffect } from 'react'
import { 
    Box, 
    CircularProgress, 
    Typography 
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useInterventions } from '@/hooks/useInterventions'
import { useStudents } from '@/hooks/useStudents'
import { useUsers } from '@/hooks/useUsers'
import InterventionForm from '../../components/InterventionForm'

export default function EditInterventionPage({ params }) {
    const router = useRouter()
    const { 
        data: interventionsData, 
        isLoading: isInterventionLoading, 
        error: interventionError 
    } = useInterventions({
        filters: {
            id: params.id
        }
    })

    const { 
        data: studentsData, 
        isLoading: isStudentsLoading,
        error: studentsError
    } = useStudents()

    const { 
        data: usersData, 
        isLoading: isUsersLoading,
        error: usersError
    } = useUsers()

    // Obtener la intervención específica
    const intervention = interventionsData?.data?.[0]

    // Combinar estados de carga
    const isLoading = isInterventionLoading || isStudentsLoading || isUsersLoading

    // Logs de depuración
    useEffect(() => {
        console.log('Intervention Data:', interventionsData)
        console.log('Students Data:', studentsData)
        console.log('Users Data:', usersData)
        console.log('Intervention Loading:', isInterventionLoading)
        console.log('Students Loading:', isStudentsLoading)
        console.log('Users Loading:', isUsersLoading)
        console.log('Students Error:', studentsError)
        console.log('Users Error:', usersError)
    }, [interventionsData, studentsData, usersData])

    if (isLoading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        )
    }

    if (interventionError || !intervention) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="400px"
            >
                <Typography color="error">
                    {interventionError 
                        ? 'Error al cargar la intervención' 
                        : 'Intervención no encontrada'
                    }
                </Typography>
            </Box>
        )
    }

    // Transformar datos si es necesario
    const transformedStudentsData = studentsData?.data || studentsData || []
    const transformedUsersData = usersData?.data || usersData || []

    return (
        <InterventionForm 
            initialData={intervention}
            studentsData={transformedStudentsData}
            usersData={transformedUsersData}
        />
    )
}
