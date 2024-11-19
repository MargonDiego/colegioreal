// lib/api/services/students.js
import { axiosPrivate } from '../axios';

export const studentsApi = {
    getAll: async (params = {}) => {
        const queryParams = {
            grade: params.grade,
            isActive: params.isActive,
            search: params.search,
            page: params.page || 1,
            limit: params.limit || 10,
            academicYear: params.academicYear,
            section: params.section,
            matriculaNumber: params.matriculaNumber,
            enrollmentStatus: params.enrollmentStatus,
            previousSchool: params.previousSchool,
            comuna: params.comuna,
            region: params.region,
            apoderadoTitular: params.apoderadoTitular,
            prevision: params.prevision,
            grupoSanguineo: params.grupoSanguineo,
            condicionesMedicas: params.condicionesMedicas,
            diagnosticoPIE: params.diagnosticoPIE,
            necesidadesEducativas: params.necesidadesEducativas,
            beneficioJUNAEB: params.beneficioJUNAEB,
            tipoBeneficioJUNAEB: params.tipoBeneficioJUNAEB,
            prioritario: params.prioritario,
            preferente: params.preferente,
        };

        if (queryParams.matriculaNumber && !/^\d+$/.test(queryParams.matriculaNumber)) {
            throw new Error('El número de matrícula debe contener solo dígitos.');
        }
        if (queryParams.academicYear && (queryParams.academicYear < 2000 || queryParams.academicYear > new Date().getFullYear())) {
            throw new Error('El año académico debe estar entre 2000 y el año actual.');
        }

        const response = await axiosPrivate.get('/students', { params: queryParams });
        return response.data;
    },

    getOne: async (id) => {
        if (!id) throw new Error('El ID del estudiante es requerido.');
        const response = await axiosPrivate.get(`/students/${id}`);
        return response.data;
    },

    checkRutExists: async (rut) => {
        if (!rut || typeof rut !== 'string') {
            return { exists: false, message: 'RUT inválido' };
        }

        try {
            // Añadir un delay mínimo para evitar llamadas muy rápidas
            await new Promise(resolve => setTimeout(resolve, 100));

            const response = await axiosPrivate.get(`/students/check-rut/${rut}`);
            return {
                exists: response.data.exists,
                message: response.data.message
            };
        } catch (error) {
            if (error.response?.status === 400) {
                return {
                    exists: false,
                    message: error.response.data.message || 'RUT inválido'
                };
            }
            throw new Error(error.response?.data?.message || 'Error al verificar RUT');
        }
    },

    create: async (data) => {
        console.log('studentApi.create called with data:', data);

        if (!data.firstName || !data.lastName || !data.rut || !data.matriculaNumber) {
            console.error('Missing required fields:', {
                firstName: !data.firstName,
                lastName: !data.lastName,
                rut: !data.rut,
                matriculaNumber: !data.matriculaNumber
            });
            throw new Error('Campos obligatorios faltantes');
        }

        try {
            console.log('Sending request to server...');
            const response = await axiosPrivate.post('/students', data);
            console.log('Server response:', response);
            return response.data;
        } catch (error) {
            console.error('Error in create student service:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });

            if (error.response?.status === 401) {
                console.error('Authentication error - token may be invalid');
            }

            throw error;
        }
    },

    update: async (id, data) => {
        if (!id) throw new Error('El ID del estudiante es requerido para actualizar.');
        if (!data.firstName || !data.lastName) {
            throw new Error('Nombre y apellido son obligatorios para actualizar.');
        }

        // Verificar si se está actualizando el RUT
        if (data.rut) {
            const rutCheck = await studentsApi.checkRutExists(data.rut);
            if (rutCheck.exists) {
                throw new Error('Ya existe otro estudiante con este RUT');
            }
            if (!/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(data.rut)) {
                throw new Error('El RUT tiene un formato inválido.');
            }
        }

        const response = await axiosPrivate.put(`/students/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        if (!id) throw new Error('El ID del estudiante es requerido para eliminar.');
        const response = await axiosPrivate.delete(`/students/${id}`);
        return response.data;
    },
};