// lib/api/services/users.js
import { axiosPrivate } from '../axios';

export const usersApi = {
    getAll: async (params = {}) => {
        // Validaciones y manejo de parámetros completos
        const queryParams = {
            role: params.role,
            department: params.department,
            staffType: params.staffType,
            isActive: params.isActive,
            search: params.search,
            permisos: params.permisos,
            subjectsTeaching: params.subjectsTeaching,
            position: params.position,
            especialidad: params.especialidad,
            registroSecreduc: params.registroSecreduc,
            mencionesExtra: params.mencionesExtra,
            phoneNumber: params.phoneNumber,
            birthDate: params.birthDate,
            address: params.address,
            comuna: params.comuna,
            region: params.region,
            emergencyContact: params.emergencyContact,
            tipoContrato: params.tipoContrato,
            horasContrato: params.horasContrato,
            fechaIngreso: params.fechaIngreso,
            bieniosReconocidos: params.bieniosReconocidos,
            evaluacionDocente: params.evaluacionDocente,
            configuracionNotificaciones: params.configuracionNotificaciones,
            lastLogin: params.lastLogin,
            loginAttempts: params.loginAttempts,
            lastLoginAttempt: params.lastLoginAttempt,
            page: params.page || 1,
            limit: params.limit || 10,
        };

        // Validaciones de negocio
        if (queryParams.phoneNumber && queryParams.phoneNumber.length < 8) {
            throw new Error('El número de teléfono debe tener al menos 8 dígitos.');
        }
        if (queryParams.birthDate && new Date(queryParams.birthDate) > new Date()) {
            throw new Error('La fecha de nacimiento no puede ser en el futuro.');
        }

        const response = await axiosPrivate.get('/users', { params: queryParams });
        return response.data;
    },

    getOne: async (id) => {
        if (!id) throw new Error('El ID del usuario es requerido.');
        const response = await axiosPrivate.get(`/users/${id}`);
        return response.data;
    },

    create: async (data) => {
        // Validaciones antes de crear
        if (!data.firstName || !data.lastName || !data.email || !data.rut) {
            throw new Error('Nombre, apellido, email y RUT son obligatorios.');
        }
        if (!/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(data.rut)) {
            throw new Error('El RUT tiene un formato inválido.');
        }

        const response = await axiosPrivate.post('/users', data);
        return response.data;
    },

    update: async (id, data) => {
        if (!id) throw new Error('El ID del usuario es requerido para actualizar.');
        if (!data.firstName || !data.lastName) {
            throw new Error('Nombre y apellido son obligatorios para actualizar.');
        }

        const response = await axiosPrivate.put(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        if (!id) throw new Error('El ID del usuario es requerido para eliminar.');
        const response = await axiosPrivate.delete(`/users/${id}`);
        return response.data;
    },
};
