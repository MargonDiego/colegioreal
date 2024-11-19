import { useMemo } from 'react';
import useAuthStore from './useAuth';

export const PERMISSIONS = {
    ENTITIES: {
        STUDENT: {
            READ: ['Admin', 'User', 'Viewer'],
            CREATE: ['Admin', 'User'],
            UPDATE: ['Admin', 'User'],
            DELETE: ['Admin']
        },
        INTERVENTION: {
            READ: ['Admin', 'User', 'Viewer'],
            CREATE: ['Admin', 'User', 'Viewer'],
            UPDATE: ['Admin', 'User', 'Viewer'],
            DELETE: ['Admin']
        },
        COMMENT: {
            READ: ['Admin', 'User', 'Viewer'],
            CREATE: ['Admin', 'User', 'Viewer'],
            UPDATE: ['Admin', 'User', 'Viewer'],
            DELETE: ['Admin']
        },
        USER: {
            READ: ['Admin', 'User'],
            CREATE: ['Admin'],
            UPDATE: ['Admin'],
            DELETE: ['Admin']
        },
        DASHBOARD: {
            READ: ['Admin', 'User', 'Viewer']
        },
        AUDIT: {
            READ: ['Admin']
        }
    },

    ROUTES: {
        '/dashboard': ['Admin', 'User', 'Viewer'],
        '/students': ['Admin', 'User', 'Viewer'],
        '/students/new': ['Admin', 'User'],
        '/students/edit': ['Admin', 'User'],
        '/students/:id': ['Admin', 'User', 'Viewer'],
        '/interventions': ['Admin', 'User', 'Viewer'],
        '/interventions/new': ['Admin', 'User', 'Viewer'],
        '/interventions/edit': ['Admin', 'User', 'Viewer'],
        '/interventions/:id': ['Admin', 'User', 'Viewer'],
        '/users': ['Admin', 'User'],
        '/users/new': ['Admin'],
        '/users/edit': ['Admin'],
        '/users/:id': ['Admin'],
        '/audit': ['Admin'],
        '/audit/:id': ['Admin']
    }
};

export function usePermissions() {
    const user = useAuthStore((state) => {
        //console.log("Información del usuario en usePermissions:", state.user);
        return state.user;
    });

    const permissions = useMemo(() => ({
        checkEntity: (entity, operation) => {
            if (!user) {
                //console.error("No hay usuario autenticado.");
                return false;
            }

            // console.log(`Verificando permisos para el rol: ${user.role}, entidad: ${entity}, operación: ${operation}`);

            const normalizedEntity = entity.toUpperCase();
            const normalizedOperation = operation.toUpperCase();

            if (!normalizedEntity || !normalizedOperation) {
                // console.error("Entidad u operación inválida.");
                return false;
            }

            const entityPermissions = PERMISSIONS.ENTITIES[normalizedEntity];
            if (!entityPermissions) {
                //console.warn(`La entidad '${normalizedEntity}' no está definida en los permisos.`);
                return false;
            }

            const operationPermissions = entityPermissions[normalizedOperation];
            if (!operationPermissions) {
                // console.warn(`La operación '${normalizedOperation}' no está definida para la entidad '${normalizedEntity}'.`);
                return false;
            }

            const hasPermission = operationPermissions.includes(user.role);
            //console.log(`Resultado del chequeo: ${hasPermission ? "Permiso concedido" : "Permiso denegado"}`);
            return hasPermission;
        },

        checkRoute: (route) => {
            if (!user) {
                //console.error("No hay usuario autenticado.");
                return false;
            }

            console.log(`Verificando permisos de ruta para el rol: ${user.role}, ruta: ${route}`);

            const routeMatch = Object.entries(PERMISSIONS.ROUTES).find(([pattern]) => {
                const regex = new RegExp('^' + pattern.replace(/:[^\s/]+/g, '[^/]+') + '$');
                return regex.test(route);
            });

            const hasAccess = routeMatch ? routeMatch[1].includes(user.role) : false;
            //console.log(`Acceso a la ruta '${route}': ${hasAccess ? "Permitido" : "Denegado"}`);
            return hasAccess;
        },

        checkPermission: (entity, operation) => {
            if (!user) {
                //console.error("No hay usuario autenticado.");
                return false;
            }
            const role = user.role;
            //console.log(`Verificando permiso específico para el rol: ${role}, entidad: ${entity}, operación: ${operation}`);

            switch (role) {
                case 'Admin':
                    return true;

                case 'User':
                    return operation.toLowerCase() !== 'delete';

                case 'Viewer':
                    switch (entity.toLowerCase()) {
                        case 'student':
                            return operation.toLowerCase() === 'read';
                        case 'intervention':
                        case 'comment':
                            return ['read', 'create', 'update'].includes(operation.toLowerCase());
                        default:
                            return false;
                    }

                default:
                    return false;
            }
        }
    }), [user]);

    return permissions;
}
