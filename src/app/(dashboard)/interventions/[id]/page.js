'use client'

import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import InterventionDetails from '../components/InterventionDetails'
import { useInterventions } from '@/hooks/useInterventions'
import ProtectedResource from '@/components/auth/ProtectedResource'

export default function InterventionPage({ params }) {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const { 
        data: interventionData, 
        isLoading, 
        error,
        deleteMutation 
    } = useInterventions({
        filters: {
            id: params.id
        }
    })

    const intervention = interventionData?.data?.[0]

    const handleDelete = async () => {
        try {
            console.log('Intentando eliminar intervención:', params.id)
            const result = await deleteMutation.mutateAsync(params.id)
            console.log('Resultado de eliminación:', result)
            enqueueSnackbar('Intervención eliminada exitosamente', { variant: 'success' })
            router.push('/interventions')
        } catch (error) {
            console.error('Error al eliminar la intervención:', error)
            enqueueSnackbar(`Error al eliminar la intervención: ${error.message}`, { variant: 'error' })
        } finally {
            setOpenDeleteDialog(false)
        }
    }

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        )
    }

    if (error || !intervention) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">
                    {error ? 'Error al cargar la intervención' : 'Intervención no encontrada'}
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3, pt: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.back()}
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" component="h1">
                        Detalles de la Intervención
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ProtectedResource 
                        entity="INTERVENTION" 
                        operation="UPDATE"
                    >
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => router.push(`/interventions/${params.id}/edit`)}
                        >
                            Editar
                        </Button>
                    </ProtectedResource>
                    <ProtectedResource 
                        entity="INTERVENTION" 
                        operation="DELETE"
                    >
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setOpenDeleteDialog(true)}
                        >
                            Eliminar
                        </Button>
                    </ProtectedResource>
                </Box>
            </Box>

            <InterventionDetails intervention={intervention} />

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmar eliminación"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Está seguro que desea eliminar esta intervención? 
                        Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        color="error" 
                        autoFocus
                        disabled={deleteMutation.isLoading}
                    >
                        {deleteMutation.isLoading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
