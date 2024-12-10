'use client'

import { 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    Chip,
    Divider
} from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import InterventionComments from './InterventionComments'

const Section = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
                {title}
            </Typography>
            {children}
        </Box>
    );
};

const Field = ({ label, value, component = Typography, show = true, ...props }) => {
    if (!show || !value) return null;
    const Component = component;
    return (
        <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
                {label}
            </Typography>
            <Component {...props}>
                {value}
            </Component>
        </Box>
    );
};

const getStatusColor = (status) => {
    const statusColors = {
        'Pendiente': 'warning',
        'En Proceso': 'info',
        'En Espera': 'warning',
        'Finalizada': 'success',
        'Derivada': 'secondary',
        'Cancelada': 'error'
    }
    return statusColors[status] || 'default'
}

const getTypeColor = (type) => {
    const typeColors = {
        'Académica': 'primary',
        'Conductual': 'error',
        'Emocional': 'secondary',
        'Social': 'success',
        'Familiar': 'warning',
        'Asistencia': 'warning',
        'Derivación': 'info',
        'PIE': 'secondary',
        'Convivencia Escolar': 'error',
        'Orientación': 'info',
        'Otro': 'default'
    }
    return typeColors[type] || 'default'
}

export default function InterventionDetails({ intervention }) {
    if (!intervention) return null;

    const formatDate = (date) => {
        if (!date) return '';
        return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
    };

    return (
        <Paper elevation={1} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Información básica */}
                <Grid item xs={12}>
                    <Section title="Información General">
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip 
                                label={intervention.type} 
                                color={getTypeColor(intervention.type)}
                            />
                            <Chip 
                                label={intervention.status} 
                                color={getStatusColor(intervention.status)}
                            />
                            {intervention.priority && (
                                <Chip 
                                    label={intervention.priority} 
                                    color={intervention.priority === 'Alta' ? 'error' : 'default'}
                                />
                            )}
                        </Box>
                        <Field 
                            label="Título" 
                            value={intervention.title} 
                            variant="h6"
                        />
                        <Field 
                            label="Descripción" 
                            value={intervention.description} 
                        />
                        <Field 
                            label="Alcance" 
                            value={intervention.interventionScope} 
                            show={!!intervention.interventionScope}
                        />
                    </Section>

                    <Divider sx={{ my: 2 }} />

                    {/* Participantes */}
                    <Section title="Participantes">
                        <Field 
                            label="Estudiante" 
                            value={intervention.student ? `${intervention.student.firstName} ${intervention.student.lastName}` : ''} 
                        />
                        <Field 
                            label="Informante" 
                            value={intervention.informer ? `${intervention.informer.firstName} ${intervention.informer.lastName}` : ''} 
                            show={!!intervention.informer}
                        />
                        <Field 
                            label="Responsable" 
                            value={intervention.responsible ? `${intervention.responsible.firstName} ${intervention.responsible.lastName}` : ''} 
                            show={!!intervention.responsible}
                        />
                    </Section>

                    <Divider sx={{ my: 2 }} />

                    {/* Fechas y Seguimiento */}
                    <Section title="Fechas y Seguimiento">
                        <Field 
                            label="Fecha de Reporte" 
                            value={formatDate(intervention.dateReported)} 
                        />
                        <Field 
                            label="Fecha de Seguimiento" 
                            value={formatDate(intervention.followUpDate)} 
                            show={!!intervention.followUpDate}
                        />
                    </Section>

                    {/* Acciones y Resultados */}
                    {(intervention.actionsTaken?.length > 0 || intervention.outcomeEvaluation) && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Section title="Acciones y Resultados">
                                {intervention.actionsTaken?.length > 0 && (
                                    <Field 
                                        label="Acciones Tomadas" 
                                        value={
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {intervention.actionsTaken.map((action, index) => (
                                                    <Chip 
                                                        key={index} 
                                                        label={action} 
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        }
                                        component={Box}
                                    />
                                )}
                                <Field 
                                    label="Evaluación de Resultados" 
                                    value={intervention.outcomeEvaluation} 
                                    show={!!intervention.outcomeEvaluation}
                                />
                            </Section>
                        </>
                    )}

                    {/* Documentación y Acuerdos */}
                    {(intervention.documentacion || intervention.acuerdos) && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Section title="Documentación y Acuerdos">
                                <Field 
                                    label="Documentación" 
                                    value={intervention.documentacion} 
                                    show={!!intervention.documentacion}
                                />
                                <Field 
                                    label="Acuerdos" 
                                    value={intervention.acuerdos} 
                                    show={!!intervention.acuerdos}
                                />
                            </Section>
                        </>
                    )}

                    {/* Estrategias y Recursos */}
                    {(intervention.estrategiasImplementadas || intervention.recursos) && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Section title="Estrategias y Recursos">
                                <Field 
                                    label="Estrategias Implementadas" 
                                    value={intervention.estrategiasImplementadas} 
                                    show={!!intervention.estrategiasImplementadas}
                                />
                                <Field 
                                    label="Recursos" 
                                    value={intervention.recursos} 
                                    show={!!intervention.recursos}
                                />
                            </Section>
                        </>
                    )}

                    {/* Seguimiento PIE y Observaciones */}
                    {(intervention.seguimientoPIE || intervention.observaciones) && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Section title="Información Adicional">
                                <Field 
                                    label="Seguimiento PIE" 
                                    value={intervention.seguimientoPIE} 
                                    show={!!intervention.seguimientoPIE}
                                />
                                <Field 
                                    label="Observaciones" 
                                    value={intervention.observaciones} 
                                    show={!!intervention.observaciones}
                                />
                            </Section>
                        </>
                    )}

                    {/* Derivación Externa */}
                    {intervention.requiresExternalReferral && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Section title="Derivación Externa">
                                <Field 
                                    label="Detalles de Derivación" 
                                    value={intervention.externalReferralDetails} 
                                />
                            </Section>
                        </>
                    )}
                </Grid>
            </Grid>

            {/* Comentarios de la Intervención */}
            <Divider sx={{ my: 2 }} />
            <InterventionComments interventionId={intervention.id} />
        </Paper>
    );
}
