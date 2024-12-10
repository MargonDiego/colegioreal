'use client'
import { useState } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Grid,
    IconButton,
    Badge,
    Tooltip,
    Card,
    CardContent,
    Modal,
    Button
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Event
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return '#ffa726';
        case 'IN_PROGRESS':
            return '#29b6f6';
        case 'COMPLETED':
            return '#66bb6a';
        case 'CANCELLED':
            return '#ef5350';
        default:
            return '#bdbdbd';
    }
};

export default function SimpleInterventionsCalendar({ interventions }) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // Obtener el primer día del mes actual
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    // Obtener el último día del mes actual
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    // Agrupar intervenciones por fecha
    const interventionsByDate = {};
    interventions?.forEach(intervention => {
        const date = new Date(intervention.createdAt).toDateString();
        if (!interventionsByDate[date]) {
            interventionsByDate[date] = [];
        }
        interventionsByDate[date].push(intervention);
    });

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
        setOpenModal(true);
    };

    const getDayInterventions = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
        return interventionsByDate[date] || [];
    };

    return (
        <Paper sx={{ p: 2 }}>
            {/* Cabecera del calendario */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handlePrevMonth}>
                    <ChevronLeft />
                </IconButton>
                <Typography variant="h6">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>
                <IconButton onClick={handleNextMonth}>
                    <ChevronRight />
                </IconButton>
            </Box>

            {/* Días de la semana */}
            <Grid container spacing={1}>
                {DAYS_OF_WEEK.map(day => (
                    <Grid item xs key={day} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2">{day}</Typography>
                    </Grid>
                ))}

                {/* Días vacíos antes del primer día del mes */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <Grid item xs key={`empty-${index}`}>
                        <Box sx={{ p: 2 }} />
                    </Grid>
                ))}

                {/* Días del mes */}
                {Array.from({ length: totalDays }).map((_, index) => {
                    const day = index + 1;
                    const interventions = getDayInterventions(day);
                    const hasInterventions = interventions.length > 0;

                    return (
                        <Grid item xs key={day}>
                            <Tooltip title={hasInterventions ? `${interventions.length} intervenciones` : ''}>
                                <Box
                                    onClick={() => handleDateClick(day)}
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderRadius: 1,
                                        position: 'relative',
                                        '&:hover': {
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <Typography>
                                        {hasInterventions ? (
                                            <Badge
                                                badgeContent={interventions.length}
                                                color="primary"
                                            >
                                                {day}
                                            </Badge>
                                        ) : day}
                                    </Typography>
                                </Box>
                            </Tooltip>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Modal de intervenciones */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{ 
                    width: '80%', 
                    maxWidth: 600,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    p: 3
                }}>
                    <Typography variant="h6" gutterBottom>
                        Intervenciones del {selectedDate?.toLocaleDateString()}
                    </Typography>
                    {selectedDate && getDayInterventions(selectedDate.getDate()).map(intervention => (
                        <Card key={intervention.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">
                                        {intervention.type}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            bgcolor: getStatusColor(intervention.status)
                                        }}
                                    />
                                </Box>
                                <Typography color="textSecondary" gutterBottom>
                                    {new Date(intervention.createdAt).toLocaleTimeString()}
                                </Typography>
                                <Typography variant="body2">
                                    {intervention.description}
                                </Typography>
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        router.push(`/interventions/${intervention.id}`);
                                        setOpenModal(false);
                                    }}
                                    sx={{ mt: 1 }}
                                >
                                    Ver detalles
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {(!selectedDate || getDayInterventions(selectedDate.getDate()).length === 0) && (
                        <Typography color="textSecondary">
                            No hay intervenciones para este día
                        </Typography>
                    )}
                </Box>
            </Modal>
        </Paper>
    );
}
