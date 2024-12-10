// lib/api/services/students.js
import { axiosPrivate } from '../axios';

export const studentsApi = {
    async getAll(params = {}) {
        try {
            const queryParams = {
                ...params,
                isActive: params.isActive || 'true', // Por defecto, mostrar solo activos
                limit: params.limit || 1000
            };

            console.log('Obteniendo estudiantes con parámetros:', queryParams);
            const response = await axiosPrivate.get('/students', { params: queryParams });
            console.log('Estudiantes obtenidos:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
            throw new Error('No se pudieron obtener los estudiantes');
        }
    },

    async getOne(id) {
        if (!id) throw new Error('El ID del estudiante es requerido.');
        try {
            const response = await axiosPrivate.get(`/students/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Estudiante no encontrado');
            }
            console.error('Error al obtener estudiante:', error);
            throw new Error('No se pudo obtener el estudiante');
        }
    },

    async checkRutExists(rut) {
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

    async create(data) {
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
            console.error('Error al crear estudiante:', error);
            throw new Error('No se pudo crear el estudiante');
        }
    },

    async update(id, data) {
        if (!id) throw new Error('El ID del estudiante es requerido para actualizar.');
        if (!data.firstName || !data.lastName) {
            throw new Error('Nombre y apellido son obligatorios para actualizar.');
        }

        // Verificar si se está actualizando el RUT y es diferente al actual
        if (data.rut) {
            try {
                const currentStudent = await studentsApi.getOne(id);
                if (currentStudent.rut !== data.rut) {
                    const rutCheck = await studentsApi.checkRutExists(data.rut);
                    if (rutCheck.exists) {
                        throw new Error('Ya existe otro estudiante con este RUT');
                    }
                }
            } catch (error) {
                if (error.message !== 'Ya existe otro estudiante con este RUT') {
                    console.error('Error al verificar RUT:', error);
                }
                throw error;
            }
        }

        try {
            console.log('Enviando datos de actualización:', data);
            const response = await axiosPrivate.put(`/students/${id}`, data);
            console.log('Respuesta de actualización:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error detallado al actualizar estudiante:', error.response?.data || error);
            if (error.response?.status === 404) {
                throw new Error('Estudiante no encontrado');
            }
            throw new Error(error.response?.data?.message || 'No se pudo actualizar el estudiante');
        }
    },

    async delete(id) {
        if (!id) throw new Error('El ID del estudiante es requerido para eliminar.');
        try {
            const response = await axiosPrivate.delete(`/students/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Estudiante no encontrado');
            }
            console.error('Error al eliminar estudiante:', error);
            throw new Error('No se pudo eliminar el estudiante');
        }
    },
};