// hooks/api/useInterventions.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { usePermissions } from './usePermissions';
import { useState } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

export function useInterventions(options = {}) {
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();
    const { checkEntity } = usePermissions();
    const queryClient = useQueryClient();
    const [selectedIntervention, setSelectedIntervention] = useState(null);

    const queryParams = {
        page: options.pagination?.page || 1,
        limit: options.pagination?.limit || 10,
        type: options.filters?.type,
        status: options.filters?.status,
        priority: options.filters?.priority,
        interventionScope: options.filters?.interventionScope,
        studentId: options.filters?.studentId,
        informerId: options.filters?.informerId,
        responsibleId: options.filters?.responsibleId,
        dateFrom: options.filters?.dateFrom,
        dateTo: options.filters?.dateTo,
        actionsTaken: options.filters?.actionsTaken,
        outcomeEvaluation: options.filters?.outcomeEvaluation,
        followUpDate: options.filters?.followUpDate,
        requiresExternalReferral: options.filters?.requiresExternalReferral,
        parentFeedback: options.filters?.parentFeedback,
    };

    const query = useQuery({
        queryKey: ['interventions', queryParams],
        queryFn: async () => {
            if (!checkEntity('INTERVENTION', 'READ')) {
                throw new Error('No autorizado para ver intervenciones');
            }
            if (queryParams.dateFrom && queryParams.dateTo && new Date(queryParams.dateFrom) > new Date(queryParams.dateTo)) {
                throw new Error('La fecha de inicio no puede ser posterior a la fecha de término');
            }
            const response = await axiosPrivate.get('/interventions', { params: queryParams });
            return response.data;
        },
        keepPreviousData: true,
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            if (!checkEntity('INTERVENTION', 'CREATE')) {
                throw new Error('No autorizado para crear intervenciones');
            }
            if (!data.title || !data.type || !data.studentId) {
                throw new Error('Título, tipo e ID del estudiante son obligatorios');
            }

            const response = await axiosPrivate.post('/interventions', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['interventions']);
            enqueueSnackbar('Intervención creada correctamente', { variant: 'success' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            if (!checkEntity('INTERVENTION', 'UPDATE')) {
                throw new Error('No autorizado para actualizar intervenciones');
            }
            if (!id) throw new Error('El ID de la intervención es requerido');
            if (!data.title || !data.type) {
                throw new Error('Título y tipo son obligatorios para actualizar');
            }

            const response = await axiosPrivate.put(`/interventions/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['interventions']);
            enqueueSnackbar('Intervención actualizada correctamente', { variant: 'success' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            if (!checkEntity('INTERVENTION', 'DELETE')) {
                throw new Error('No autorizado para eliminar intervenciones');
            }
            if (!id) throw new Error('El ID de la intervención es requerido');

            const response = await axiosPrivate.delete(`/interventions/${id}`);
            return response.data;
        },
        onSuccess: (_, id) => {
            // Invalidar consultas específicas y generales
            queryClient.invalidateQueries(['interventions']);
            queryClient.invalidateQueries(['interventions', id]);
            
            // Actualizar caché manualmente
            const currentData = queryClient.getQueryData(['interventions']);
            if (currentData) {
                const updatedInterventions = {
                    ...currentData,
                    interventions: currentData.interventions.filter(intervention => intervention.id !== id)
                };
                queryClient.setQueryData(['interventions'], updatedInterventions);
            }

            enqueueSnackbar('Intervención eliminada correctamente', { variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(`Error al eliminar: ${error.message}`, { variant: 'error' });
        }
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        selectedIntervention,
        createMutation,
        updateMutation,
        deleteMutation,
        selectIntervention: setSelectedIntervention,
        clearSelection: () => setSelectedIntervention(null),
    };
}
