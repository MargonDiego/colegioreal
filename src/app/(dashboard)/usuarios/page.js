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
    pagination: {
      page: page + 1,
      limit: rowsPerPage,
    },
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      await deleteUser(id);
    }
  };

  const canCreate = checkEntity('USER', 'CREATE');
  const canEdit = checkEntity('USER', 'UPDATE');
  const canDelete = checkEntity('USER', 'DELETE');

  // Los usuarios vienen directamente en data
  const users = Array.isArray(data) ? data : [];
  const totalUsers = users.length;

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
            >
              Crear Usuario
            </Button>
          )}
        </Box>
        <Card>
          <Box sx={{ minWidth: 800, overflowX: 'auto' }}>
            <Table>
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
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow hover key={user.id}>
                      <TableCell>
                        <Typography
                          variant="body1"
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
                      <TableCell>{user.rut}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell align="right">
                        {canEdit && (
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => router.push(`/usuarios/${user.id}/editar`)}
                              disabled={isDeleting}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canDelete && (
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting}
                            >
                              <DeleteIcon />
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>
      </Box>
    </Container>
  );
}
