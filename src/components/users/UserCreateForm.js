import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useUsers } from '@/hooks/useUsers';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Collapse,
  Stack,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  FormHelperText
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const roles = [
  { value: 'Viewer', label: 'Visualizador', description: 'Solo puede ver información' },
  { value: 'User', label: 'Usuario', description: 'Acceso estándar al sistema' },
  { value: 'Admin', label: 'Administrador', description: 'Acceso completo al sistema' }
];

const staffTypes = [
  "Directivo",
  "Docente",
  "Profesional PIE",
  "Asistente de la Educación",
  "Administrativo"
];

const departments = [
  "Dirección",
  "UTP",
  "Convivencia Escolar",
  "Orientación",
  "PIE",
  "Departamento Lenguaje",
  "Departamento Matemática",
  "Departamento Ciencias",
  "Departamento Historia",
  "Departamento Inglés",
  "Departamento Arte y Música",
  "Departamento Ed. Física",
  "Inspectoría",
  "Administración"
];

const regiones = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena"
];

const tiposContrato = [
  "Planta",
  "Contrata",
  "Honorarios",
  "Reemplazo",
  "SEP"
];

const evaluacionesDocentes = [
  "Destacado",
  "Competente",
  "Básico",
  "Insatisfactorio",
  "No Aplica"
];

const asignaturas = [
  "Lenguaje",
  "Matemáticas",
  "Ciencias Naturales",
  "Historia",
  "Inglés",
  "Educación Física",
  "Artes Visuales",
  "Música",
  "Tecnología",
  "Orientación",
  "Religión"
];

const steps = [
  {
    label: 'Información de Acceso',
    description: 'Credenciales y rol del usuario',
  },
  {
    label: 'Información Personal',
    description: 'Datos personales básicos',
  },
  {
    label: 'Información de Contacto',
    description: 'Dirección y datos de contacto',
  },
  {
    label: 'Información Profesional',
    description: 'Datos laborales y profesionales',
  },
  {
    label: 'Configuración Final',
    description: 'Últimos ajustes y confirmación',
  },
];

export const UserCreateForm = ({ onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors }, setValue, watch, control, trigger } = useForm({
    mode: 'onChange',
    defaultValues: {
      isActive: true,
      subjectsTeaching: [],
      mencionesExtra: [],
      emergencyContact: {
        nombre: '',
        relacion: '',
        telefono: ''
      },
      role: '',
      staffType: '',
      region: '',
      tipoContrato: '',
      horasContrato: '',
      registroSecreduc: '',
      address: '',
      comuna: ''
    }
  });
  
  const { createMutation } = useUsers();
  const [loading, setLoading] = useState(false);
  const selectedRole = watch('role');

  const handleNext = async () => {
    const fieldsToValidate = getFieldsToValidate(activeStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getFieldsToValidate = (step) => {
    switch (step) {
      case 0: // Información de Acceso
        return ['email', 'password', 'role'];
      case 1: // Información Personal
        return ['firstName', 'lastName', 'rut'];
      case 2: // Información de Contacto
        return ['phoneNumber'];
      case 3: // Información Profesional
        return ['staffType'];
      case 4: // Configuración Final
        return [];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!createMutation) {
        throw new Error('Error de inicialización: createMutation no está disponible');
      }

      setLoading(true);
      setErrorMessage('');

      // Log the data being sent
      console.log('Form data being submitted:', data);

      // Formatear las fechas antes de enviar
      if (data.birthDate) {
        data.birthDate = dayjs(data.birthDate).format('YYYY-MM-DD');
      }
      if (data.fechaIngreso) {
        data.fechaIngreso = dayjs(data.fechaIngreso).format('YYYY-MM-DD');
      }
      
      // Ensure RUT is in uppercase for 'K'
      if (data.rut && data.rut.endsWith('-k')) {
        data.rut = data.rut.slice(0, -1) + 'K';
      }

      console.log('Mutation object:', createMutation);
      const result = await createMutation.mutateAsync(data);
      console.log('Creation successful:', result);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error detallado al crear usuario:', error);
      console.error('Response data:', error.response?.data);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'Error al crear el usuario. Por favor, verifique todos los campos obligatorios.'
      );
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico *"
                type="email"
                {...register('email', {
                  required: 'Este campo es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña *"
                type={showPassword ? "text" : "password"}
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(errors.role)}>
                <InputLabel id="role-label">Rol *</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field }) => (
                    <Select
                      labelId="role-label"
                      label="Rol *"
                      {...field}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          <Tooltip title={role.description}>
                            <Box>
                              {role.label}
                            </Box>
                          </Tooltip>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Nombres *"
                {...register('firstName', { 
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Apellidos *"
                {...register('lastName', { 
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="RUT *"
                {...register('rut', {
                  required: 'Este campo es requerido',
                  pattern: {
                    value: /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/,
                    message: 'Formato inválido. Debe ser XX.XXX.XXX-X'
                  }
                })}
                error={Boolean(errors.rut)}
                helperText={errors.rut?.message}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth
                        error={Boolean(errors.birthDate)}
                        helperText={errors.birthDate?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                {...register('address')}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Comuna"
                {...register('comuna')}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Región</InputLabel>
                <Select
                  label="Región"
                  {...register('region')}
                >
                  {regiones.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                {...register('phoneNumber', {
                  pattern: {
                    value: /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/,
                    message: 'Formato inválido. Ej: +56 9 12345678'
                  }
                })}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contacto de Emergencia
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Nombre del Contacto"
                {...register('emergencyContact.nombre')}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Relación"
                {...register('emergencyContact.relacion')}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Teléfono del Contacto"
                {...register('emergencyContact.telefono')}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Personal</InputLabel>
                <Select
                  label="Tipo de Personal"
                  {...register('staffType')}
                >
                  {staffTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {selectedRole === 'User' && (
              <>
                <Grid item md={12} xs={12}>
                  <Controller
                    name="subjectsTeaching"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        options={asignaturas}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              key={index}
                              label={option}
                              {...getTagProps({ index })}
                              onDelete={() => {
                                const newValue = [...value];
                                newValue.splice(index, 1);
                                field.onChange(newValue);
                              }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Asignaturas que Enseña"
                            placeholder="Seleccione asignaturas"
                          />
                        )}
                        onChange={(_, newValue) => field.onChange(newValue)}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Registro SECREDUC"
                    {...register('registroSecreduc')}
                  />
                </Grid>
              </>
            )}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Contrato</InputLabel>
                <Select
                  label="Tipo de Contrato"
                  {...register('tipoContrato')}
                >
                  {tiposContrato.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Horas de Contrato"
                type="number"
                {...register('horasContrato', {
                  min: { value: 1, message: 'Debe ser mayor a 0' },
                  max: { value: 44, message: 'No puede exceder 44 horas' }
                })}
                error={Boolean(errors.horasContrato)}
                helperText={errors.horasContrato?.message}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="fechaIngreso"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de Ingreso"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth
                        error={Boolean(errors.fechaIngreso)}
                        helperText={errors.fechaIngreso?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={watch('isActive')}
                    onChange={(e) => setValue('isActive', e.target.checked)}
                  />
                }
                label="Usuario Activo"
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Por favor revise la información antes de crear el usuario. Una vez creado, algunos campos no podrán ser modificados.
              </Alert>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <CardHeader 
          title="Crear Nuevo Usuario"
          subheader="Complete los datos del nuevo usuario siguiendo los pasos. Los campos marcados con * son obligatorios."
        />
        {errorMessage && (
          <Box mb={2}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  <Typography variant="caption">{step.description}</Typography>
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <form>
                  {renderStepContent(index)}
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={loading}
                      >
                        {index === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Atrás
                      </Button>
                    </div>
                  </Box>
                </form>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Todos los pasos completados</Typography>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              sx={{ mt: 1, mr: 1 }}
              startIcon={<CheckCircleIcon />}
            >
              Crear Usuario
            </LoadingButton>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default UserCreateForm;
