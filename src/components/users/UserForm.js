'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useUsers } from '@/hooks/useUsers';

const roles = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'USER', label: 'Usuario' },
  { value: 'VIEWER', label: 'Visualizador' },
];

const staffTypes = [
  { value: 'DIRECTIVO', label: 'Directivo' },
  { value: 'DOCENTE', label: 'Docente' },
  { value: 'PROFESIONAL_PIE', label: 'Profesional PIE' },
  { value: 'ASISTENTE', label: 'Asistente de la Educación' },
  { value: 'ADMINISTRATIVO', label: 'Administrativo' },
];

const departments = [
  { value: 'DIRECCION', label: 'Dirección' },
  { value: 'UTP', label: 'UTP' },
  { value: 'CONVIVENCIA_ESCOLAR', label: 'Convivencia Escolar' },
  { value: 'ORIENTACION', label: 'Orientación' },
  { value: 'PIE', label: 'PIE' },
  { value: 'DEPTO_LENGUAJE', label: 'Departamento Lenguaje' },
  { value: 'DEPTO_MATEMATICA', label: 'Departamento Matemática' },
  { value: 'DEPTO_CIENCIAS', label: 'Departamento Ciencias' },
  { value: 'DEPTO_HISTORIA', label: 'Departamento Historia' },
  { value: 'DEPTO_INGLES', label: 'Departamento Inglés' },
  { value: 'DEPTO_ARTE_MUSICA', label: 'Departamento Arte y Música' },
  { value: 'DEPTO_ED_FISICA', label: 'Departamento Ed. Física' },
  { value: 'INSPECTORIA', label: 'Inspectoría' },
  { value: 'ADMINISTRACION', label: 'Administración' },
];

const contractTypes = [
  { value: 'PLANTA', label: 'Planta' },
  { value: 'CONTRATA', label: 'Contrata' },
  { value: 'HONORARIOS', label: 'Honorarios' },
  { value: 'REEMPLAZO', label: 'Reemplazo' },
  { value: 'SEP', label: 'SEP' },
];

const regions = [
  { value: 'ARICA', label: 'Arica y Parinacota' },
  { value: 'TARAPACA', label: 'Tarapacá' },
  { value: 'ANTOFAGASTA', label: 'Antofagasta' },
  { value: 'ATACAMA', label: 'Atacama' },
  { value: 'COQUIMBO', label: 'Coquimbo' },
  { value: 'VALPARAISO', label: 'Valparaíso' },
  { value: 'METROPOLITANA', label: 'Metropolitana' },
  { value: 'OHIGGINS', label: 'O\'Higgins' },
  { value: 'MAULE', label: 'Maule' },
  { value: 'NUBLE', label: 'Ñuble' },
  { value: 'BIOBIO', label: 'Biobío' },
  { value: 'ARAUCANIA', label: 'Araucanía' },
  { value: 'LOS_RIOS', label: 'Los Ríos' },
  { value: 'LOS_LAGOS', label: 'Los Lagos' },
  { value: 'AYSEN', label: 'Aysén del General Carlos Ibáñez del Campo' },
  { value: 'MAGALLANES', label: 'Magallanes y de la Antártica Chilena' },
];

export function UserForm({ initialData, isEdit = false, onSuccess }) {
  const [error, setError] = useState(null);
  const { createUser, updateUser } = useUsers();

  const defaultValues = {
    // Información Personal
    firstName: '',
    lastName: '',
    email: '',
    password: isEdit ? undefined : '',  // Solo requerido en creación
    rut: '',
    phoneNumber: '',
    birthDate: null,
    address: '',
    comuna: '',
    region: '',
    
    // Roles y Permisos
    role: 'USER',
    permisos: [],
    
    // Información Profesional
    staffType: '',
    subjectsTeaching: [],
    position: '',
    department: '',
    especialidad: '',
    registroSecreduc: '',
    mencionesExtra: [],
    
    // Información Laboral
    tipoContrato: '',
    horasContrato: '',
    fechaIngreso: null,
    bieniosReconocidos: 0,
    evaluacionDocente: null,
    
    // Contacto de Emergencia
    emergencyContact: {
      nombre: '',
      relacion: '',
      telefono: ''
    },
    
    // Estado y configuración
    isActive: true,
    configuracionNotificaciones: null,
    
    ...(initialData && {
      ...initialData,
      birthDate: initialData.birthDate ? dayjs(initialData.birthDate) : null,
      fechaIngreso: initialData.fechaIngreso ? dayjs(initialData.fechaIngreso) : null,
      subjectsTeaching: initialData.subjectsTeaching || [],
      mencionesExtra: initialData.mencionesExtra || [],
      permisos: initialData.permisos || [],
      region: initialData.region || '',
      staffType: initialData.staffType || '',
      tipoContrato: initialData.tipoContrato || '',
      department: initialData.department || '',
      emergencyContact: initialData.emergencyContact || { nombre: '', relacion: '', telefono: '' },
      configuracionNotificaciones: initialData.configuracionNotificaciones || null,
    }),
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      setError(null);
      // Format dates before sending
      const formattedData = {
        ...data,
        birthDate: data.birthDate ? data.birthDate.format('YYYY-MM-DD') : null,
        fechaIngreso: data.fechaIngreso ? data.fechaIngreso.format('YYYY-MM-DD') : null,
      };

      if (isEdit) {
        await updateUser({ id: initialData.id, data: formattedData });
      } else {
        await createUser(formattedData);
      }
      
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Información Personal */}
            <Grid item xs={12} md={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'El nombre es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'El apellido es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Apellidos"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Formato de email inválido',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="password"
                control={control}
                rules={{ 
                  required: !isEdit && 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Contraseña"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="rut"
                control={control}
                rules={{
                  required: 'El RUT es requerido',
                  pattern: {
                    value: /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/,
                    message: 'Formato de RUT inválido. Debe ser XX.XXX.XXX-X',
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="RUT"
                    fullWidth
                    error={!!errors.rut}
                    helperText={errors.rut?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono"
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Fecha de Nacimiento"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.birthDate,
                        helperText: errors.birthDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dirección"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="comuna"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Comuna"
                    fullWidth
                    error={!!errors.comuna}
                    helperText={errors.comuna?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.region}>
                    <InputLabel>Región</InputLabel>
                    <Select
                      {...field}
                      label="Región"
                    >
                      {regions.map((region) => (
                        <MenuItem key={region.value} value={region.value}>
                          {region.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.region && (
                      <FormHelperText>{errors.region.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Información Profesional */}
            <Grid item xs={12} md={6}>
              <Controller
                name="staffType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.staffType}>
                    <InputLabel>Tipo de Personal</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de Personal"
                    >
                      {staffTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.staffType && (
                      <FormHelperText>{errors.staffType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="especialidad"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Especialidad/Título Profesional"
                    fullWidth
                    error={!!errors.especialidad}
                    helperText={errors.especialidad?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="registroSecreduc"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Registro SECREDUC"
                    fullWidth
                    error={!!errors.registroSecreduc}
                    helperText={errors.registroSecreduc?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="subjectsTeaching"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Asignaturas que imparte"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.subjectsTeaching}
                    helperText={errors.subjectsTeaching?.message || "Separar asignaturas con comas"}
                    onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                    value={field.value?.join(', ') || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="mencionesExtra"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Menciones/Especializaciones"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.mencionesExtra}
                    helperText={errors.mencionesExtra?.message || "Separar menciones con comas"}
                    onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                    value={field.value?.join(', ') || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.department}>
                    <InputLabel>Departamento</InputLabel>
                    <Select
                      {...field}
                      label="Departamento"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.department && (
                      <FormHelperText>{errors.department.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cargo"
                    fullWidth
                    error={!!errors.position}
                    helperText={errors.position?.message}
                  />
                )}
              />
            </Grid>

            {/* Información Laboral */}
            <Grid item xs={12} md={6}>
              <Controller
                name="tipoContrato"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.tipoContrato}>
                    <InputLabel>Tipo de Contrato</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de Contrato"
                    >
                      {contractTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.tipoContrato && (
                      <FormHelperText>{errors.tipoContrato.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="horasContrato"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Horas de Contrato"
                    type="number"
                    fullWidth
                    error={!!errors.horasContrato}
                    helperText={errors.horasContrato?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="fechaIngreso"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Fecha de Ingreso"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fechaIngreso,
                        helperText: errors.fechaIngreso?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="bieniosReconocidos"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bienios Reconocidos"
                    type="number"
                    fullWidth
                    error={!!errors.bieniosReconocidos}
                    helperText={errors.bieniosReconocidos?.message}
                  />
                )}
              />
            </Grid>

            {/* Contacto de Emergencia */}
            <Grid item xs={12} md={4}>
              <Controller
                name="emergencyContact.nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre Contacto Emergencia"
                    fullWidth
                    error={!!errors.emergencyContact?.nombre}
                    helperText={errors.emergencyContact?.nombre?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="emergencyContact.relacion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Relación Contacto Emergencia"
                    fullWidth
                    error={!!errors.emergencyContact?.relacion}
                    helperText={errors.emergencyContact?.relacion?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="emergencyContact.telefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono Contacto Emergencia"
                    fullWidth
                    error={!!errors.emergencyContact?.telefono}
                    helperText={errors.emergencyContact?.telefono?.message}
                  />
                )}
              />
            </Grid>

            {/* Estado */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Usuario Activo"
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Controller
                  name="configuracionNotificaciones"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Configuración de Notificaciones"
                    />
                  )}
                />
              </FormControl>
            </Grid>

          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
            >
              {isEdit ? 'Actualizar' : 'Crear'} Usuario
            </Button>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
}
