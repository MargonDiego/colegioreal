// lib/api/services/audit.js
import { axiosPrivate } from '../axios';

export const auditApi = {
    getAll: async (params = {}) => {
        // Construir los parámetros de consulta con validaciones
        const queryParams = {
            entityName: params.entityName,
            action: params.action,
            userId: params.userId,
            module: params.module,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
        };

        // Validaciones de reglas de negocio
        if (queryParams.dateFrom && isNaN(Date.parse(queryParams.dateFrom))) {
            throw new Error('La fecha "dateFrom" tiene un formato inválido.');
        }
        if (queryParams.dateTo && isNaN(Date.parse(queryParams.dateTo))) {
            throw new Error('La fecha "dateTo" tiene un formato inválido.');
        }
        if (queryParams.dateFrom && queryParams.dateTo && new Date(queryParams.dateFrom) > new Date(queryParams.dateTo)) {
            throw new Error('La fecha "dateFrom" no puede ser posterior a "dateTo".');
        }
        if (queryParams.action && !['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'READ'].includes(queryParams.action)) {
            throw new Error('La acción especificada es inválida.');
        }
        if (queryParams.module && !['AUTH', 'USERS', 'STUDENTS', 'COMMENTS', 'INTERVENTIONS', 'AUDITS'].includes(queryParams.module)) {
            throw new Error('El módulo especificado es inválido.');
        }

        try {
            const response = await axiosPrivate.get('/audit', { params: queryParams });
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener registros de auditoría: ${error.message}`);
        }
    },

    getOne: async (id) => {
        if (!id) throw new Error('El ID del registro de auditoría es requerido.');
        try {
            const response = await axiosPrivate.get(`/audit/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener el registro de auditoría: ${error.message}`);
        }
    },
};
