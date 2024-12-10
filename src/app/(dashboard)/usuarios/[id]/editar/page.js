'use client';

import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { useUsers } from '@/hooks/useUsers';
import { UserForm } from '@/components/users/UserForm';
import { useRouter } from 'next/navigation';

export default function EditUserPage({ params }) {
  const router = useRouter();
  const { data: user, isLoading, isError, error } = useUsers({
    filters: { id: parseInt(params.id) }
  });

  const handleSuccess = () => {
    router.push(`/usuarios/${params.id}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">
          {error?.message || 'Error al cargar el usuario'}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Usuario no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar Usuario
        </Typography>
        <UserForm
          initialData={user}
          isEdit={true}
          onSuccess={handleSuccess}
        />
      </Box>
    </Container>
  );
}
