'use client';

import { usePermissions } from '@/hooks/usePermissions';

const ProtectedResource = ({
                               entity,
                               operation,
                               children,
                               fallback = null
                           }) => {
    const { checkEntity } = usePermissions();

    if (!entity || !operation) {
        console.error("Entidad u operación no especificada en ProtectedResource.");
        return fallback;
    }

    if (!checkEntity(entity, operation)) {
        console.warn(`Acceso denegado para la entidad '${entity}' y operación '${operation}'.`);
        return fallback;
    }
    return children;
};

export default ProtectedResource;
