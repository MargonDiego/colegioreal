// lib/api/services/interventionComments.js
import { axiosPrivate } from '../axios';

export const interventionCommentsApi = {
    getAll: async (params = {}) => {
        // Manejo de parámetros y validaciones
        const queryParams = {
            tipo: params.tipo,
            isPrivate: params.isPrivate,
            interventionId: params.interventionId,
            userId: params.userId,
            page: params.page || 1,
            limit: params.limit || 10,
        };

        // Validaciones de reglas de negocio
        if (queryParams.tipo && !['Observación', 'Feedback', 'Informe'].includes(queryParams.tipo)) {
            throw new Error('El tipo de comentario es inválido. Debe ser "Observación", "Feedback" o "Informe".');
        }
        if (queryParams.interventionId && isNaN(queryParams.interventionId)) {
            throw new Error('El ID de la intervención debe ser un número válido.');
        }

        const response = await axiosPrivate.get('/intervention-comments', { params: queryParams });
        return response.data;
    },

    getOne: async (id) => {
        if (!id) throw new Error('El ID del comentario es requerido.');
        const response = await axiosPrivate.get(`/intervention-comments/${id}`);
        return response.data;
    },

    create: async (data) => {
        // Validaciones antes de crear
        if (!data.content || !data.tipo || !data.interventionId) {
            throw new Error('El contenido, tipo e ID de la intervención son obligatorios.');
        }
        if (data.isPrivate !== undefined && typeof data.isPrivate !== 'boolean') {
            throw new Error('El campo "isPrivate" debe ser booleano.');
        }
        if (!['Observación', 'Feedback', 'Informe'].includes(data.tipo)) {
            throw new Error('El tipo de comentario es inválido. Debe ser "Observación", "Feedback" o "Informe".');
        }
        if (data.evidencias && !Array.isArray(data.evidencias)) {
            throw new Error('Las evidencias deben ser un arreglo.');
        }

        const response = await axiosPrivate.post('/intervention-comments', data);
        return response.data;
    },

    update: async (id, data) => {
        if (!id) throw new Error('El ID del comentario es requerido para actualizar.');
        if (!data.content) {
            throw new Error('El contenido del comentario es obligatorio para actualizar.');
        }
        if (data.tipo && !['Observación', 'Feedback', 'Informe'].includes(data.tipo)) {
            throw new Error('El tipo de comentario es inválido.');
        }

        const response = await axiosPrivate.put(`/intervention-comments/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        if (!id) throw new Error('El ID del comentario es requerido para eliminar.');
        const response = await axiosPrivate.delete(`/intervention-comments/${id}`);
        return response.data;
    },
};
