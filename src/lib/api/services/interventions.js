// lib/api/services/interventions.js
import { axiosPrivate } from '../axios';

export const interventionsApi = {
    getAll: async (params = {}) => {
        // Validaciones de reglas de negocio y manejo de filtros
        const queryParams = {
            type: params.type,
            status: params.status,
            priority: params.priority,
            interventionScope: params.interventionScope,
            studentId: params.studentId,
            informerId: params.informerId,
            responsibleId: params.responsibleId,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            actionsTaken: params.actionsTaken,
            outcomeEvaluation: params.outcomeEvaluation,
            followUpDate: params.followUpDate,
            requiresExternalReferral: params.requiresExternalReferral,
            parentFeedback: params.parentFeedback,
            externalReferralDetails: params.externalReferralDetails,
            documentacion: params.documentacion,
            acuerdos: params.acuerdos,
            recursos: params.recursos,
            observaciones: params.observaciones,
            page: params.page || 1,
            limit: params.limit || 10,
        };

        // Validar fechas antes de enviar la solicitud
        if (queryParams.dateFrom && queryParams.dateTo && new Date(queryParams.dateFrom) > new Date(queryParams.dateTo)) {
            throw new Error('La fecha de inicio no puede ser posterior a la fecha de término');
        }

        const response = await axiosPrivate.get('/interventions', { params: queryParams });
        return response.data;
    },

    getOne: async (id) => {
        if (!id) throw new Error('El ID de la intervención es requerido');
        const response = await axiosPrivate.get(`/interventions/${id}`);
        return response.data;
    },

    create: async (data) => {
        // Validaciones antes de enviar los datos
        if (!data.title || !data.type || !data.studentId) {
            throw new Error('Título, tipo e ID del estudiante son obligatorios');
        }

        const response = await axiosPrivate.post('/interventions', data);
        return response.data;
    },

    update: async (id, data) => {
        if (!id) throw new Error('El ID de la intervención es requerido para actualizar');
        if (!data.title || !data.type) {
            throw new Error('Título y tipo son obligatorios para actualizar');
        }

        const response = await axiosPrivate.put(`/interventions/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        if (!id) throw new Error('El ID de la intervención es requerido para eliminar');
        const response = await axiosPrivate.delete(`/interventions/${id}`);
        return response.data;
    },
};
