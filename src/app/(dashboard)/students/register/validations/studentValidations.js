import * as yup from 'yup';

const phoneRegExp = /^\+569\d{8}$/;
const rutRegExp = /^([0-9]{1,2}(\.[0-9]{3}){2}|[0-9]{7,8})-[0-9kK]{1}$/;
const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const studentValidationSchema = yup.object().shape({
    // Información Personal
    firstName: yup.string()
        .required('El nombre es obligatorio')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede tener más de 50 caracteres'),
    lastName: yup.string()
        .required('El apellido es obligatorio')
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede tener más de 50 caracteres'),
    rut: yup.string()
        .required('El RUT es obligatorio')
        .matches(rutRegExp, 'Formato de RUT inválido (ej: 12.345.678-9)'),
    email: yup.string()
        .nullable()
        .matches(emailRegExp, 'Formato de email inválido'),
    birthDate: yup.date()
        .max(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 3), 'El estudiante debe tener al menos 3 años')
        .min(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 20), 'Edad máxima 20 años'),
    gender: yup.string()
        .nullable()
        .oneOf(['Masculino', 'Femenino', 'No Binario', 'Otro'], 'Seleccione un género válido'),
    nationality: yup.string()
        .nullable()
        .default('Chilena'),

    // Información Académica
    grade: yup.string()
        .required('El grado es obligatorio')
        .oneOf([
            'Pre-Kinder', 'Kinder',
            '1° Básico', '2° Básico', '3° Básico', '4° Básico',
            '5° Básico', '6° Básico', '7° Básico', '8° Básico',
            '1° Medio', '2° Medio', '3° Medio', '4° Medio'
        ], 'Seleccione un grado válido'),
    academicYear: yup.number()
        .required('El año académico es obligatorio')
        .min(2000, 'El año académico debe ser posterior al 2000')
        .max(new Date().getFullYear() + 1, 'El año académico no puede ser futuro'),
    section: yup.string()
        .nullable(),
    matriculaNumber: yup.string()
        .required('El número de matrícula es obligatorio')
        .matches(/^\d{4,8}$/, 'El número de matrícula debe tener entre 4 y 8 dígitos'),
    enrollmentStatus: yup.string()
        .default('Regular')
        .oneOf(['Regular', 'Suspendido', 'Retirado', 'Egresado', 'Trasladado'], 'Estado de matrícula inválido'),
    previousSchool: yup.string()
        .nullable(),

    // Información de Contacto y Familia
    address: yup.string()
        .nullable()
        .max(200, 'La dirección no puede tener más de 200 caracteres'),
    comuna: yup.string()
        .required('La comuna es obligatoria')
        .min(2, 'La comuna debe tener al menos 2 caracteres')
        .max(50, 'La comuna no puede tener más de 50 caracteres'),
    region: yup.string()
        .required('La región es obligatoria')
        .oneOf([
            'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
            'Coquimbo', 'Valparaíso', 'Metropolitana', 'O\'Higgins',
            'Maule', 'Ñuble', 'Biobío', 'Araucanía', 'Los Ríos',
            'Los Lagos', 'Aysén del General Carlos Ibáñez del Campo',
            'Magallanes y de la Antártica Chilena'
        ], 'Seleccione una región válida'),
    apoderadoTitular: yup.object({
        name: yup.string()
            .required('El nombre del apoderado es obligatorio'),
        rut: yup.string()
            .required('El RUT del apoderado es obligatorio')
            .matches(rutRegExp, 'Formato de RUT inválido'),
        phone: yup.string()
            .required('El teléfono del apoderado es obligatorio')
            .matches(phoneRegExp, 'Formato de teléfono inválido (+569XXXXXXXX)'),
        email: yup.string()
            .required('El email del apoderado es obligatorio')
            .matches(emailRegExp, 'Formato de email inválido'),
    }).required('La información del apoderado titular es obligatoria'),

    apoderadoSuplente: yup.object({
        name: yup.string(),
        rut: yup.string()
            .matches(rutRegExp, 'Formato de RUT inválido'),
        phone: yup.string()
            .matches(phoneRegExp, 'Formato de teléfono inválido (+569XXXXXXXX)'),
        email: yup.string()
            .matches(emailRegExp, 'Formato de email inválido'),
    }).nullable(),

    grupoFamiliar: yup.string()
        .nullable(),
    contactosEmergencia: yup.array()
        .required('Debe agregar al menos un contacto de emergencia')
        .min(1, 'Debe agregar al menos un contacto de emergencia'),

    // Información de Salud
    prevision: yup.string()
        .nullable()
        .oneOf(['Fonasa', 'Isapre', 'Ninguna'], 'Seleccione una previsión válida'),
    grupoSanguineo: yup.string()
        .nullable()
        .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Grupo sanguíneo inválido'),
    condicionesMedicas: yup.array()
        .nullable(),
    alergias: yup.array()
        .nullable(),
    medicamentos: yup.array()
        .nullable(),

    // Necesidades Educativas Especiales
    diagnosticoPIE: yup.mixed()
        .nullable(),
    necesidadesEducativas: yup.mixed()
        .nullable(),
    apoyosPIE: yup.mixed()
        .nullable(),

    // Información Socioeconómica
    beneficioJUNAEB: yup.boolean()
        .default(false),
    tipoBeneficioJUNAEB: yup.array()
        .nullable(),
    prioritario: yup.boolean()
        .default(false),
    preferente: yup.boolean()
        .default(false),
    becas: yup.mixed()
        .nullable(),

    // Registros
    simceResults: yup.mixed()
        .nullable(),
    academicRecord: yup.mixed()
        .nullable(),
    attendance: yup.mixed()
        .nullable(),
    registroConvivencia: yup.mixed()
        .nullable(),
    medidasDisciplinarias: yup.mixed()
        .nullable(),
    reconocimientos: yup.mixed()
        .nullable(),

    // Metadatos
    isActive: yup.boolean()
        .default(true),
    observaciones: yup.string()
        .nullable(),
});