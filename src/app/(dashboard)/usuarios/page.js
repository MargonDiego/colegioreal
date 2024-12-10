'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useUsers } from '@/hooks/useUsers';
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const { checkEntity } = usePermissions();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, isLoading, deleteUser, isDeleting } = useUsers({
    filters: {
      isActive: true
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteUser = async (id) => {
    try {
      if (window.confirm('¿Está seguro de eliminar este usuario?')) {
        console.log('Intentando eliminar usuario:', id);
        await deleteUser(id);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      // El mensaje de error se mostrará a través del hook useUsers (enqueueSnackbar)
    }
  };

  const canCreate = checkEntity('USER', 'CREATE');
  const canEdit = checkEntity('USER', 'UPDATE');
  const canDelete = checkEntity('USER', 'DELETE');

  // Los usuarios vienen directamente en data
  const users = Array.isArray(data) ? data : [];
  const totalUsers = users.length;

  // Aplicar paginación en el cliente
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mb: 2,
          }}
        >
          <Typography variant="h4">
            Usuarios ({totalUsers})
          </Typography>
          {canCreate && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => router.push('/usuarios/crear')}
              startIcon={<AddIcon />}
              disabled={isDeleting}
            >
              Crear Usuario
            </Button>
          )}
        </Box>
        <Card>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>RUT</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow hover key={user.id}>
                    <TableCell sx={{ py: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={() => router.push(`/usuarios/${user.id}`)}
                      >
                        {`${user.firstName} ${user.lastName}`}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>{user.rut}</TableCell>
                    <TableCell sx={{ py: 1 }}>{user.email}</TableCell>
                    <TableCell sx={{ py: 1 }}>{user.role}</TableCell>
                    <TableCell align="right" sx={{ py: 1, whiteSpace: 'nowrap' }}>
                      {canEdit && (
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/usuarios/${user.id}/editar`)}
                            disabled={isDeleting}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canDelete && (
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isDeleting}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={totalUsers}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      </Box>
    </Container>
  );
}
