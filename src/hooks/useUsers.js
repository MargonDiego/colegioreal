// hooks/api/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { usePermissions } from '@/hooks/usePermissions';
import { useState } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

export function useUsers(options = {}) {
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();
    const { checkEntity } = usePermissions();
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState(null);

    // Validación de RUT chileno
    const validateRut = (rut) => {
        if (!/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/i.test(rut)) {
            throw new Error('Formato de RUT inválido. Debe ser XX.XXX.XXX-X');
        }
        // Convertir 'k' minúscula a mayúscula si es necesario
        if (rut.endsWith('-k')) {
            rut = rut.slice(0, -1) + 'K';
        }
        return true;
    };

    // Validación de email
    const validateEmail = (email) => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            throw new Error('Formato de email inválido');
        }
        return true;
    };

    // Si se proporciona un ID, obtener usuario específico
    const userId = options.filters?.id;
    const isSpecificUser = Boolean(userId);

    const query = useQuery({
        queryKey: isSpecificUser ? ['user', userId] : ['users', options],
        queryFn: async () => {
            if (!checkEntity('USER', 'READ')) {
                throw new Error('No autorizado para ver usuarios.');
            }

            if (isSpecificUser) {
                const response = await axiosPrivate.get(`/users/${userId}`);
                return response.data;
            } else {
                const response = await axiosPrivate.get('/users', { 
                    params: {
                        role: options.filters?.role,
                        isActive: options.filters?.isActive,
                        search: options.filters?.search,
                        region: options.filters?.region,
                        page: options.pagination?.page || 1,
                        limit: options.pagination?.limit || 10,
                    }
                });
                return response.data;
            }
        },
        enabled: checkEntity('USER', 'READ') && (!isSpecificUser || Boolean(userId)),
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            if (!checkEntity('USER', 'CREATE')) {
                throw new Error('No autorizado para crear usuarios.');
            }

            // Validaciones obligatorias
            if (!data.firstName?.trim()) throw new Error('El nombre es obligatorio');
            if (!data.lastName?.trim()) throw new Error('El apellido es obligatorio');
            if (!data.email?.trim()) throw new Error('El email es obligatorio');
            if (!data.rut?.trim()) throw new Error('El RUT es obligatorio');
            if (!data.password?.trim()) throw new Error('La contraseña es obligatoria');
            if (!data.role?.trim()) throw new Error('El rol es obligatorio');

            // Validaciones de formato
            validateRut(data.rut);
            validateEmail(data.email);

            if (data.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            try {
                const response = await axiosPrivate.post('/users', data);
                return response.data;
            } catch (error) {
                console.error('Error en createMutation:', error);
                throw error.response?.data?.message || error.message || 'Error al crear usuario';
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            enqueueSnackbar('Usuario creado correctamente.', { variant: 'success' });
        },
        onError: (error) => {
            console.error('Error en onError:', error);
            enqueueSnackbar(error.message || 'Error al crear usuario', { variant: 'error' });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            if (!checkEntity('USER', 'UPDATE')) {
                throw new Error('No autorizado para actualizar usuarios.');
            }

            // Validaciones obligatorias
            if (!data.firstName?.trim()) throw new Error('El nombre es obligatorio');
            if (!data.lastName?.trim()) throw new Error('El apellido es obligatorio');
            if (data.email?.trim()) validateEmail(data.email);
            if (data.rut?.trim()) validateRut(data.rut);
            if (data.password?.trim() && data.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            const response = await axiosPrivate.put(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            queryClient.invalidateQueries(['user']);
            enqueueSnackbar('Usuario actualizado correctamente.', { variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(error.message || 'Error al actualizar usuario', { variant: 'error' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            if (!checkEntity('USER', 'DELETE')) {
                throw new Error('No autorizado para eliminar usuarios.');
            }
            const response = await axiosPrivate.delete(`/users/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            enqueueSnackbar('Usuario eliminado correctamente.', { variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(error.message || 'Error al eliminar usuario', { variant: 'error' });
        }
    });

    return {
        // Queries
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        
        // Mutations
        createMutation,
        updateMutation,
        deleteMutation,
        createUser: createMutation.mutate,
        updateUser: updateMutation.mutate,
        deleteUser: deleteMutation.mutate,
        
        // Estado de las mutaciones
        isCreating: createMutation.isLoading,
        isUpdating: updateMutation.isLoading,
        isDeleting: deleteMutation.isLoading,
        
        // Estado seleccionado
        selectedUser,
        setSelectedUser,
    };
}
