// hooks/api/useStudents.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { usePermissions } from '@/hooks/usePermissions';
import { useState } from 'react';
import useAxiosPrivate from './useAxiosPrivate';
import { studentsApi } from '@/lib/api/services/students';

export function useStudents(options = {}) {
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
        grade: options.filters?.grade,
        isActive: options.filters?.isActive,
        search: options.filters?.search,
        academicYear: options.filters?.academicYear,
        section: options.filters?.section,
        matriculaNumber: options.filters?.matriculaNumber,
        enrollmentStatus: options.filters?.enrollmentStatus,
        comuna: options.filters?.comuna,
        region: options.filters?.region,
        page: options.pagination?.page || 1,
        limit: options.pagination?.limit || 10,
    };

    // Consulta para obtener la lista de estudiantes
    const query = useQuery({
        queryKey: ['students', queryParams],
        queryFn: async () => {
            if (!checkEntity('STUDENT', 'READ')) {
                throw new Error('No autorizado para ver estudiantes.');
            }
            const response = await axiosPrivate.get('/students', { params: queryParams });
            return response.data;
        },
        keepPreviousData: true,
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
            if (!checkEntity('STUDENT', 'UPDATE')) {
                throw new Error('No autorizado para actualizar estudiantes.');
            }

            if (!id) throw new Error('El ID del estudiante es requerido.');

            if (data.rut) {
                const normalizedRut = normalizeRut(data.rut);
                if (!validateRut(normalizedRut)) {
                    throw new Error('El RUT tiene un formato inválido.');
                }

                const rutExists = await checkRutExists(normalizedRut);
                if (rutExists) {
                    throw new Error('Ya existe otro estudiante con este RUT.');
                }

                data.rut = normalizedRut;
            }

            const response = await studentsApi.update(id, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            enqueueSnackbar('Estudiante actualizado correctamente.', { variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(error.message, { variant: 'error' });
        },
    });

    // Mutación para eliminar un estudiante
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            if (!checkEntity('STUDENT', 'DELETE')) {
                throw new Error('No autorizado para eliminar estudiantes.');
            }
            if (!id) throw new Error('El ID del estudiante es requerido.');

            const response = await axiosPrivate.delete(`/students/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            enqueueSnackbar('Estudiante eliminado correctamente.', { variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(error.message, { variant: 'error' });
        },
    });

    // Exportar funciones y estados del hook
    return {
        createStudent: (data) => {
            console.log('createStudent called with:', data);
            return createMutation.mutateAsync(data);
        },
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        selectedStudent,
        updateStudent: updateMutation.mutate,
        deleteStudent: deleteMutation.mutate,
        checkRutExists,
        normalizeRut,
        validateRut,
        selectStudent: setSelectedStudent,
        clearSelection: () => setSelectedStudent(null),
        canCreate: checkEntity('STUDENT', 'CREATE'),
        canUpdate: checkEntity('STUDENT', 'UPDATE'),
        canDelete: checkEntity('STUDENT', 'DELETE'),
    };
}
