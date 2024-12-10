// hooks/api/useStudents.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { usePermissions } from '@/hooks/usePermissions';
import { useState } from 'react';
import useAxiosPrivate from './useAxiosPrivate';
import { studentsApi } from '@/lib/api/services/students';

export function useStudents({ studentId } = {}) {
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();
    const { checkEntity } = usePermissions();
    const queryClient = useQueryClient();
    const [selectedStudent, setSelectedStudent] = useState(null);

    /**
     * Normaliza el RUT al formato requerido por el backend (XXXXXXXX-X)
     */
    const normalizeRut = (rut) => {
        if (!rut) return '';

        // Primer paso: eliminar todos los puntos y espacios
        let cleaned = rut.replace(/[.\s]/g, '').toUpperCase();

        // Si no tiene guión, agregarlo antes del último carácter
        if (!cleaned.includes('-') && cleaned.length > 1) {
            cleaned = cleaned.slice(0, -1) + '-' + cleaned.slice(-1);
        }

        return cleaned;
    };

    const validateRut = (rut) => {
        if (!rut) return false;

        // Verificar formato básico
        const rutRegex = /^\d{7,8}-[0-9K]$/;
        if (!rutRegex.test(rut)) return false;

        // Separar cuerpo y dígito verificador
        const [body, dv] = rut.split('-');
        let suma = 0;
        let multiplicador = 2;

        // Calcular dígito verificador
        for (let i = body.length - 1; i >= 0; i--) {
            suma += parseInt(body.charAt(i)) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const dvEsperado = 11 - (suma % 11);
        const dvCalculado = dvEsperado === 11 ? '0' :
            dvEsperado === 10 ? 'K' :
                dvEsperado.toString();

        return dv === dvCalculado;
    };

    /**
     * Verifica si ya existe un estudiante con el RUT proporcionado.
     * @param {string} rut - El RUT a verificar.
     * @returns {Promise<boolean>} - `true` si el RUT ya existe, `false` en caso contrario.
     */
    const checkRutExists = async (rut) => {
        const normalizedRut = normalizeRut(rut);
        if (!validateRut(normalizedRut)) {
            return { exists: false, message: 'RUT inválido' };
        }
        try {
            const response = await studentsApi.checkRutExists(normalizedRut);
            return response;
        } catch (error) {
            console.error('Error verificando RUT:', error);
            return { exists: false, message: error.message };
        }
    };

    // Parámetros de consulta para la API
    const queryParams = {
        grade: studentId,
        isActive: studentId,
        search: studentId,
        academicYear: studentId,
        section: studentId,
        matriculaNumber: studentId,
        enrollmentStatus: studentId,
        comuna: studentId,
        region: studentId
    };

    // Query para obtener estudiantes
    const { data, isLoading, error } = useQuery({
        queryKey: ['students', studentId, queryParams],
        queryFn: async () => {
            try {
                if (studentId) {
                    const response = await studentsApi.getOne(studentId);
                    return { data: [response] };
                } else {
                    console.log('Obteniendo lista completa de estudiantes...');
                    const response = await studentsApi.getAll(queryParams);
                    console.log('Estudiantes obtenidos:', response);
                    return response;
                }
            } catch (error) {
                console.error('Error al obtener estudiantes:', error);
                throw error;
            }
        },
        staleTime: 30000, // 30 segundos antes de considerar los datos obsoletos
        cacheTime: 300000, // 5 minutos de cache
    });

    // Mutación para crear un nuevo estudiante
    const createMutation = useMutation({
        mutationFn: async (data) => {
            console.log('Creating student with data:', data);
            const response = await studentsApi.create(data);
            return response;
        },
        onSuccess: () => {
            console.log('Student created successfully');
            queryClient.invalidateQueries(['students']);
        },
        onError: (error) => {
            console.error('Error in createMutation:', error);
            throw error;
        }
    });

    // Mutación para actualizar un estudiante
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            if (!id) throw new Error('El ID del estudiante es requerido.');
            
            try {
                const response = await studentsApi.update(id, data);
                return response;
            } catch (error) {
                console.error('Error en updateMutation:', error);
                throw error;
            }
        },
        onSuccess: (data, variables) => {
            // Actualizar la caché del estudiante específico
            queryClient.setQueryData(['students', variables.id], (oldData) => {
                if (oldData) {
                    return { data: [data] };
                }
                return oldData;
            });
            
            // Invalidar la lista general de estudiantes
            queryClient.invalidateQueries(['students']);
        },
        onError: (error) => {
            console.error('Error en updateMutation:', error);
            enqueueSnackbar(error.message || 'Error al actualizar estudiante', { variant: 'error' });
        },
    });

    // Mutación para eliminar un estudiante
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            if (!checkEntity('STUDENT', 'DELETE')) {
                throw new Error('No autorizado para eliminar estudiantes.');
            }
            try {
                console.log('Intentando eliminar estudiante con ID:', id);
                const response = await studentsApi.delete(id);
                console.log('Respuesta de eliminación:', response);
                return response;
            } catch (error) {
                console.error('Error al eliminar estudiante:', error);
                if (error.response?.status === 404) {
                    throw new Error('Estudiante no encontrado');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                } else {
                    throw new Error('Error al eliminar estudiante');
                }
            }
        },
        onSuccess: (_, id) => {
            console.log('Estudiante eliminado exitosamente:', id);
            queryClient.invalidateQueries(['students']);
            queryClient.invalidateQueries(['student', id]);
            enqueueSnackbar('Estudiante eliminado correctamente', { 
                variant: 'success',
                autoHideDuration: 3000
            });
        },
        onError: (error) => {
            console.error('Error en la eliminación:', error);
            enqueueSnackbar(error.message || 'Error al eliminar estudiante', { 
                variant: 'error',
                autoHideDuration: 5000
            });
        }
    });

    // Retornar los valores y funciones necesarias
    return {
        data,
        isLoading,
        error,
        selectedStudent,
        setSelectedStudent,
        createStudent: createMutation.mutate,
        updateStudent: updateMutation.mutate,
        deleteStudent: deleteMutation.mutate,
        isDeleting: deleteMutation.isLoading,
        checkRutExists,
        normalizeRut,
        validateRut
    };
}
