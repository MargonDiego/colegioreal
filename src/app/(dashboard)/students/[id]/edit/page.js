'use client';

import { Container, Typography, Paper, Box } from '@mui/material';
import StudentEditForm from './StudentEditForm';
import ProtectedResource from '@/components/auth/ProtectedResource';
import { useParams } from 'next/navigation';

export default function StudentEditPage() {
    const { id } = useParams();

    return (
        <ProtectedResource entity="student" operation="UPDATE">
            <Container maxWidth="lg">
                <Paper sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Editar Estudiante
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <StudentEditForm studentId={id} />
                    </Box>
                </Paper>
            </Container>
        </ProtectedResource>
    );
}