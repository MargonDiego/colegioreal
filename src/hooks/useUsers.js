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

    const queryParams = {
        role: options.filters?.role,
        department: options.filters?.department,
        staffType: options.filters?.staffType,
        isActive: options.filters?.isActive,
        search: options.filters?.search,
        permisos: options.filters?.permisos,
        subjectsTeaching: options.filters?.subjectsTeaching,
        position: options.filters?.position,
        phoneNumber: options.filters?.phoneNumber,
        birthDate: options.filters?.birthDate,
        address: options.filters?.address,
        comuna: options.filters?.comuna,
        region: options.filters?.region,
        emergencyContact: options.filters?.emergencyContact,
        page: options.pagination?.page || 1,
        limit: options.pagination?.limit || 10,
    };

    const query = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            if (!checkEntity('USER', 'READ')) {
                throw new Error('No autorizado para ver usuarios.');
            }
            if (queryParams.phoneNumber && queryParams.phoneNumber.length < 8) {
                throw new Error('El número de teléfono debe tener al menos 8 dígitos.');
            }
            const response = await axiosPrivate.get('/users', { params: queryParams });
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            if (!checkEntity('USER', 'CREATE')) {
                throw new Error('No autorizado para crear usuarios.');
            }
            if (!data.firstName || !data.lastName || !data.email || !data.rut) {
                throw new Error('Nombre, apellido, email y RUT son obligatorios.');
            }

            const response = await axiosPrivate.post('/users', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            enqueueSnackbar('Usuario creado correctamente.', { variant: 'success' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            if (!checkEntity('USER', 'UPDATE')) {
                throw new Error('No autorizado para actualizar usuarios.');
            }
            if (!id) throw new Error('El ID del usuario es requerido.');
            if (!data.firstName || !data.lastName) {
                throw new Error('Nombre y apellido son obligatorios para actualizar.');
            }

            const response = await axiosPrivate.put(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            enqueueSnackbar('Usuario actualizado correctamente.', { variant: 'success' });
        },
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
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        selectedUser,
        createUser: createMutation.mutate,
        updateUser: updateMutation.mutate,
        deleteUser: deleteMutation.mutate,
        selectUser: setSelectedUser,
        clearSelection: () => setSelectedUser(null),
    };
}
