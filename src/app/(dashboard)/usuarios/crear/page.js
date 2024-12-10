'use client';

import { Container, Box, Typography } from '@mui/material';
import { UserCreateForm } from '@/components/users/UserCreateForm';
import { useRouter } from 'next/navigation';

export default function CreateUserPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/usuarios');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crear Usuario
        </Typography>
        <UserCreateForm onSuccess={handleSuccess} />
      </Box>
    </Container>
  );
}
