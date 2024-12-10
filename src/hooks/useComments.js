// hooks/api/useComments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { usePermissions } from '@/hooks/usePermissions';
import { useState } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

export function useComments(interventionId, options = {}) {
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();
    const { checkEntity } = usePermissions();
    const queryClient = useQueryClient();
    const [selectedComment, setSelectedComment] = useState(null);

    const commentTypes = [
        'Seguimiento', 'Entrevista', 'Acuerdo',
        'Observación', 'Derivación', 'Contacto Apoderado',
        'Reunión Equipo', 'Otro'
    ];

    // Valores por defecto para paginación
    const defaultPagination = {
        page: 1,
        limit: 10,
    };

    // Construir parámetros de consulta
    const queryParams = {
        ...defaultPagination,
        ...options.pagination,
        tipo: options.filters?.tipo,
        isPrivate: options.filters?.isPrivate,
        userId: options.filters?.userId,
    };

    // Solo agregar interventionId si está presente
    if (interventionId) {
        queryParams.interventionId = interventionId;
    }

    // Validaciones antes de la solicitud
    if (queryParams.tipo && !commentTypes.includes(queryParams.tipo)) {
        throw new Error('El tipo de comentario es inválido.');
    }

    const query = useQuery({
        queryKey: ['intervention-comments', interventionId, queryParams],
        queryFn: async () => {
            if (!checkEntity('COMMENT', 'READ')) {
                throw new Error('No autorizado para ver comentarios.');
            }
            const response = await axiosPrivate.get('/intervention-comments', { params: queryParams });
            return response.data;
        },
        enabled: true, // Ahora siempre está habilitado
        keepPreviousData: true,
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            if (!checkEntity('COMMENT', 'CREATE')) {
                throw new Error('No autorizado para crear comentarios.');
            }

            // Validaciones de datos
            if (!data.content || data.content.trim() === '') {
                throw new Error('El contenido del comentario es obligatorio.');
            }
            if (!commentTypes.includes(data.tipo)) {
                throw new Error('El tipo de comentario es inválido.');
            }
            if (data.evidencias && !Array.isArray(data.evidencias)) {
                throw new Error('Las evidencias deben ser un arreglo.');
            }
            if (typeof data.isPrivate !== 'boolean') {
                throw new Error('El campo "isPrivate" debe ser booleano.');
            }

            const commentData = {
                content: data.content,
                tipo: data.tipo || 'Seguimiento',
                evidencias: data.evidencias || [],
                isPrivate: data.isPrivate || false,
                intervention: { id: interventionId },
            };

            const response = await axiosPrivate.post('/intervention-comments', commentData);
            return response.data;
        },
        onSuccess: (newComment) => {
            queryClient.invalidateQueries(['intervention-comments', interventionId]);
            enqueueSnackbar('Comentario agregado correctamente', { variant: 'success' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            if (!checkEntity('COMMENT', 'UPDATE')) {
                throw new Error('No autorizado para actualizar comentarios.');
            }
            if (!id) throw new Error('El ID del comentario es requerido.');

            const commentData = {
                content: data.content,
                tipo: data.tipo,
                evidencias: data.evidencias || [],
                isPrivate: data.isPrivate,
                intervention: { id: interventionId },
                userId: data.userId
            };

            const response = await axiosPrivate.put(`/intervention-comments/${id}`, commentData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['intervention-comments', interventionId]);
            enqueueSnackbar('Comentario actualizado correctamente', { variant: 'success' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            if (!checkEntity('COMMENT', 'DELETE')) {
                throw new Error('No autorizado para eliminar comentarios.');
            }
            await axiosPrivate.delete(`/intervention-comments/${id}`);
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.invalidateQueries(['intervention-comments', interventionId]);
            enqueueSnackbar('Comentario eliminado correctamente', { variant: 'success' });
        },
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
        createComment: (data) => createMutation.mutateAsync(data),
        updateComment: (id, data) => updateMutation.mutateAsync({ id, data }),
        deleteComment: (id) => deleteMutation.mutateAsync(id),
        selectedComment,
        setSelectedComment,
        commentTypes
    };
}
