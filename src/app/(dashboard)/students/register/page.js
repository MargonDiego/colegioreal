'use client';

import StudentRegisterForm from './StudentRegisterForm';
import { Container } from '@mui/material';

export default function RegisterStudentPage() {
    return (
        <Container maxWidth="lg" className="py-8">
            <StudentRegisterForm />
        </Container>
    );
}