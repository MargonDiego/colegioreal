'use client';

import { useEffect, useState } from 'react';
import { Typography, Container, Button, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import StudentsTable from './StudentsTable';
import { useStudents } from '@/hooks/useStudents';
import ProtectedResource from '@/components/auth/ProtectedResource';
import { useRouter } from 'next/navigation';

export default function StudentsListPage() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lógica para obtener estudiantes
    const { data: studentsData, isLoading, isError } = useStudents({
        filters: { isActive: true },
        pagination: { limit: 100 },
    });

    useEffect(() => {
        if (!isLoading && studentsData?.data) {
            setStudents(studentsData.data);
            setLoading(false);
        }
        if (isError) {
            setError('Error al cargar los estudiantes');
            setLoading(false);
        }
    }, [studentsData, isLoading, isError]);


    // Función para redirigir a la página de detalles del estudiante
    const handleViewStudent = (id) => {
        router.push(`/students/${id}`);
    };

    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5">Listado de Estudiantes</Typography>
            </Box>

            {error && (
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            )}

            {/* Pasamos la función handleViewStudent como prop a StudentsTable */}
            <StudentsTable students={students} loading={loading} onViewStudent={handleViewStudent} />
        </Container>
    );
}
