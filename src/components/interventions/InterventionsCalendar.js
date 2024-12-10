'use client'
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';

const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return '#ffa726'; // orange
        case 'IN_PROGRESS':
            return '#29b6f6'; // light blue
        case 'COMPLETED':
            return '#66bb6a'; // green
        case 'CANCELLED':
            return '#ef5350'; // red
        default:
            return '#bdbdbd'; // grey
    }
};

export default function InterventionsCalendar({ interventions }) {
    const router = useRouter();

    // Transformar las intervenciones al formato que espera FullCalendar
    const events = interventions?.map(intervention => ({
        id: intervention.id,
        title: intervention.type,
        start: intervention.createdAt,
        end: intervention.followUpDate || intervention.createdAt,
        backgroundColor: getStatusColor(intervention.status),
        extendedProps: {
            description: intervention.description,
            status: intervention.status,
            type: intervention.type
        }
    })) || [];

    const handleEventClick = (clickInfo) => {
        router.push(`/interventions/${clickInfo.event.id}`);
    };

    const renderEventContent = (eventInfo) => {
        return (
            <Tooltip title={eventInfo.event.extendedProps.description}>
                <Box sx={{ p: 1 }}>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                        {eventInfo.event.title}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                        {eventInfo.event.extendedProps.status}
                    </Typography>
                </Box>
            </Tooltip>
        );
    };

    return (
        <Paper sx={{ p: 2, height: '600px' }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                height="100%"
                locale="es"
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día'
                }}
            />
        </Paper>
    );
}
