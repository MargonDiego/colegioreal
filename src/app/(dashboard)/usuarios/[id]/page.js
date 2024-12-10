'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useUsers } from '@/hooks/useUsers';
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';

const InfoSection = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom color="primary">
      {title}
    </Typography>
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  </Box>
);

const InfoField = ({ label, value, xs = 6 }) => (
  <Grid item xs={12} md={xs}>
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
    <Typography variant="body1">
      {value || 'No especificado'}
    </Typography>
  </Grid>
);

const ArrayField = ({ label, values }) => (
  <Grid item xs={12}>
    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
      {label}
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {values && values.length > 0 ? (
        values.map((value, index) => (
          <Chip key={index} label={value} size="small" />
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No especificado
        </Typography>
      )}
    </Box>
  </Grid>
);

export default function UserDetailPage({ params }) {
  const router = useRouter();
  const { checkEntity } = usePermissions();
  const { data: user, isLoading, isError, error } = useUsers({
    filters: { id: parseInt(params.id) }
  });

  const canEdit = checkEntity('USER', 'UPDATE');

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column" gap={2}>
        <Typography color="error">
          {error?.message || 'Error al cargar el usuario'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/usuarios')}
          variant="outlined"
        >
          Volver a la lista
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column" gap={2}>
        <Typography>Usuario no encontrado</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/usuarios')}
          variant="outlined"
        >
          Volver a la lista
        </Button>
      </Box>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'No especificado';
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/usuarios')}
          >
            Volver a la lista
          </Button>
          {canEdit && (
            <Tooltip title="Editar Usuario">
              <IconButton
                color="primary"
                onClick={() => router.push(`/usuarios/${params.id}/editar`)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Información Personal */}
        <InfoSection title="Información Personal">
          <InfoField label="Nombre Completo" value={`${user.firstName} ${user.lastName}`} xs={12} />
          <InfoField label="RUT" value={user.rut} />
          <InfoField label="Email" value={user.email} />
          <InfoField label="Teléfono" value={user.phoneNumber} />
          <InfoField label="Fecha de Nacimiento" value={formatDate(user.birthDate)} />
        </InfoSection>

        {/* Roles y Permisos */}
        <InfoSection title="Roles y Permisos">
          <InfoField label="Rol" value={user.role} />
          <ArrayField label="Permisos" values={user.permisos} />
        </InfoSection>

        {/* Información Profesional */}
        <InfoSection title="Información Profesional">
          <InfoField label="Tipo de Personal" value={user.staffType} />
          <InfoField label="Cargo" value={user.position} />
          <InfoField label="Departamento" value={user.department} />
          <InfoField label="Especialidad" value={user.especialidad} />
          <InfoField label="Registro SECREDUC" value={user.registroSecreduc} />
          <ArrayField label="Asignaturas que Imparte" values={user.subjectsTeaching} />
          <ArrayField label="Menciones Extra" values={user.mencionesExtra} />
        </InfoSection>

        {/* Información de Contacto */}
        <InfoSection title="Información de Contacto">
          <InfoField label="Dirección" value={user.address} xs={12} />
          <InfoField label="Comuna" value={user.comuna} />
          <InfoField label="Región" value={user.region} />
          {user.emergencyContact && (
            <>
              <InfoField 
                label="Contacto de Emergencia" 
                value={`${user.emergencyContact.nombre} (${user.emergencyContact.relacion})`} 
              />
              <InfoField 
                label="Teléfono de Emergencia" 
                value={user.emergencyContact.telefono} 
              />
            </>
          )}
        </InfoSection>

        {/* Información Laboral */}
        <InfoSection title="Información Laboral">
          <InfoField label="Tipo de Contrato" value={user.tipoContrato} />
          <InfoField label="Horas de Contrato" value={user.horasContrato ? `${user.horasContrato} horas` : null} />
          <InfoField label="Fecha de Ingreso" value={formatDate(user.fechaIngreso)} />
          <InfoField label="Bienios Reconocidos" value={user.bieniosReconocidos} />
          {user.evaluacionDocente && (
            <InfoField 
              label="Evaluación Docente" 
              value={`${user.evaluacionDocente.periodo}: ${user.evaluacionDocente.resultado}`} 
            />
          )}
        </InfoSection>

        {/* Estado del Usuario */}
        <InfoSection title="Estado">
          <InfoField 
            label="Estado" 
            value={user.isActive ? 'Activo' : 'Inactivo'} 
          />
          <InfoField 
            label="Último Acceso" 
            value={formatDate(user.lastLogin)} 
          />
        </InfoSection>
      </Box>
    </Container>
  );
}
