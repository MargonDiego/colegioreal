// hooks/api/useAudit.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { usePermissions } from '@/hooks/usePermissions';
import { useState } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

export function useAudit(options = {}) {
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();
    const { checkEntity } = usePermissions();
    const queryClient = useQueryClient();
    const [selectedAudit, setSelectedAudit] = useState(null);

    // Construir parámetros de consulta con validaciones
    const queryParams = {
        entityName: options.filters?.entityName,
        action: options.filters?.action,
        userId: options.filters?.userId,
        module: options.filters?.module,
        dateFrom: options.filters?.dateFrom,
        dateTo: options.filters?.dateTo,
        page: options.pagination?.page || 1,
        limit: options.pagination?.limit || 10,
        relations: options.relations,
    };

    // Validaciones de reglas de negocio
    if (queryParams.dateFrom && isNaN(Date.parse(queryParams.dateFrom))) {
        throw new Error('La fecha "dateFrom" tiene un formato inválido.');
    }
    if (queryParams.dateTo && isNaN(Date.parse(queryParams.dateTo))) {
        throw new Error('La fecha "dateTo" tiene un formato inválido.');
    }
    if (queryParams.dateFrom && queryParams.dateTo && new Date(queryParams.dateFrom) > new Date(queryParams.dateTo)) {
        throw new Error('La fecha "dateFrom" no puede ser posterior a "dateTo".');
    }
    if (queryParams.action && !['CREAR', 'MODIFICAR', 'ELIMINAR', 'VISUALIZAR', 'DESCARGAR'].includes(queryParams.action)) {
        throw new Error('La acción especificada es inválida.');
    }
    if (queryParams.module && !['ESTUDIANTES', 'INTERVENCIONES', 'USUARIOS', 'DOCUMENTOS', 'SISTEMA', 'AUTH', 'COMENTARIOS_INTERVENCIONES'].includes(queryParams.module)) {
        throw new Error('El módulo especificado es inválido.');
    }

    const query = useQuery({
        queryKey: ['audit', queryParams],
        queryFn: async () => {
            if (!checkEntity('AUDIT', 'READ')) {
                throw new Error('No autorizado para ver registros de auditoría.');
            }
            const response = await axiosPrivate.get('/audit', { params: queryParams });
            return response.data;
        },
        keepPreviousData: true,
    });

    const getAuditDetail = async (id) => {
        if (!checkEntity('AUDIT', 'READ')) {
            throw new Error('No autorizado para ver detalles de auditoría.');
        }
        if (!id) throw new Error('El ID del registro de auditoría es requerido.');

        try {
            const response = await axiosPrivate.get(`/audit/${id}`);
            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Error al obtener detalles de auditoría', {
                variant: 'error',
            });
            throw error;
        }
    };

    const exportAudit = async (format = 'csv') => {
        if (!checkEntity('AUDIT', 'READ')) {
            throw new Error('No autorizado para exportar registros de auditoría.');
        }
        if (!['csv', 'xlsx'].includes(format)) {
            throw new Error('El formato de exportación es inválido. Debe ser "csv" o "xlsx".');
        }

        try {
            const response = await axiosPrivate.get('/audit/export', {
                params: {
                    ...queryParams,
                    format,
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `auditoria.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            enqueueSnackbar('Error al exportar registros de auditoría', { variant: 'error' });
        }
    };

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        selectedAudit,
        getAuditDetail,
        exportAudit,
        selectAudit: setSelectedAudit,
        clearSelection: () => setSelectedAudit(null),
        refresh: () => queryClient.invalidateQueries(['audit']),
        pagination: {
            currentPage: query.data?.page || queryParams.page,
            totalPages: Math.ceil((query.data?.total || 0) / queryParams.limit),
            totalItems: query.data?.total || 0,
            itemsPerPage: queryParams.limit,
        },
        canAccess: checkEntity('AUDIT', 'READ'),
        auditActions: ['CREAR', 'MODIFICAR', 'ELIMINAR', 'VISUALIZAR', 'DESCARGAR'],
        modules: ['ESTUDIANTES', 'INTERVENCIONES', 'USUARIOS', 'DOCUMENTOS', 'SISTEMA', 'AUTH', 'COMENTARIOS_INTERVENCIONES'],
        entities: ['Student', 'Intervention', 'User', 'InterventionComment', 'Authentication'],
        formatValues: (values) => {
            try {
                return typeof values === 'string' ? JSON.parse(values) : values;
            } catch {
                return values;
            }
        },
    };
}
