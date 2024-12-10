'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Button,
    Paper
} from '@mui/material';
import { Add as AddIcon, ViewList, CalendarMonth } from '@mui/icons-material';
import { useInterventions } from '@/hooks/useInterventions';
import InterventionsList from '@/components/interventions/InterventionsList';
import SimpleInterventionsCalendar from '@/components/interventions/SimpleInterventionsCalendar';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>{children}</Box>
            )}
        </div>
    );
}

export default function StudentInterventions({ studentId }) {
    const [viewMode, setViewMode] = useState(0);
    const { data: interventionsData, isLoading } = useInterventions({
        filters: {
            studentId: parseInt(studentId)
        }
    });

    const handleViewChange = (event, newValue) => {
        setViewMode(newValue);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3 
                }}
            >
                <Typography variant="h5" fontWeight="medium">
                    Intervenciones del Estudiante
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="medium"
                >
                    Nueva Intervención
                </Button>
            </Box>

            <Paper elevation={2} sx={{ borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={viewMode}
                        onChange={handleViewChange}
                        variant="fullWidth"
                    >
                        <Tab 
                            icon={<ViewList />} 
                            label="Lista" 
                            sx={{ 
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                alignItems: 'center'
                            }}
                        />
                        <Tab 
                            icon={<CalendarMonth />} 
                            label="Calendario"
                            sx={{ 
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                alignItems: 'center'
                            }}
                        />
                    </Tabs>
                </Box>

                <TabPanel value={viewMode} index={0}>
                    <InterventionsList 
                        interventions={interventionsData?.data || []} 
                        isLoading={isLoading}
                    />
                </TabPanel>

                <TabPanel value={viewMode} index={1}>
                    <SimpleInterventionsCalendar 
                        interventions={interventionsData?.data || []}
                    />
                </TabPanel>
            </Paper>
        </Box>
    );
}
