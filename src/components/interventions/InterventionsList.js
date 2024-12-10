'use client'
import { Box, Typography, Card, CardContent, Chip, Grid, CircularProgress, Alert, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Visibility } from '@mui/icons-material';

export default function InterventionsList({ interventions, isLoading }) {
    const router = useRouter();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (!interventions?.length) {
        return (
            <Alert severity="info">No hay intervenciones registradas.</Alert>
        );
    }

    return (
        <Grid container spacing={2}>
            {interventions.map((intervention) => (
                <Grid item xs={12} key={intervention.id}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h6" component="div">
                                        {intervention.type}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        Fecha: {new Date(intervention.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Chip 
                                        label={intervention.status}
                                        color={
                                            intervention.status === 'PENDING' ? 'warning' :
                                            intervention.status === 'IN_PROGRESS' ? 'info' :
                                            intervention.status === 'COMPLETED' ? 'success' : 'default'
                                        }
                                    />
                                    <IconButton 
                                        color="primary"
                                        onClick={() => router.push(`/interventions/${intervention.id}`)}
                                        title="Ver detalles"
                                    >
                                        <Visibility />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {intervention.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
