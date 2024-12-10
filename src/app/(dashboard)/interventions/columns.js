"use client"

import { IconButton, Chip, Box, Tooltip, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from "next/navigation"
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import ProtectedResource from '@/components/auth/ProtectedResource'
import { useInterventions } from '@/hooks/useInterventions'

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

export const columns = [
    {
        field: "title",
        headerName: "Título",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {
            const description = params.row.description || ''
            return (
                <Tooltip title={description} arrow>
                    <Typography
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                        }}
                    >
                        {params.value}
                    </Typography>
                </Tooltip>
            )
        }
    },
    {
        field: "type",
        headerName: "Tipo",
        flex: 1,
        minWidth: 130,
        renderCell: (params) => {
            return (
                <Chip
                    label={params.value}
                    color={getTypeColor(params.value)}
                    size="small"
                />
            )
        }
    },
    {
        field: "status",
        headerName: "Estado",
        flex: 1,
        minWidth: 130,
        renderCell: (params) => {
            return (
                <Chip
                    label={params.value}
                    color={getStatusColor(params.value)}
                    size="small"
                />
            )
        }
    },
    {
        field: "dateReported",
        headerName: "Fecha",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
            const date = new Date(params.value)
            return (
                <Tooltip 
                    title={format(date, "d 'de' MMMM 'de' yyyy", { locale: es })} 
                    arrow
                >
                    <Typography>
                        {format(date, "dd/MM/yyyy", { locale: es })}
                    </Typography>
                </Tooltip>
            )
        }
    },
    {
        field: "student",
        headerName: "Estudiante",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {
            const student = params.row.student
            if (!student) return ''
            
            const fullName = `${student.firstName} ${student.lastName}`
            const details = [
                student.grade && `Curso: ${student.grade}`,
                student.matriculaNumber && `Matrícula: ${student.matriculaNumber}`,
            ].filter(Boolean).join(' | ')

            return (
                <Tooltip title={details} arrow>
                    <Typography>
                        {fullName}
                    </Typography>
                </Tooltip>
            )
        }
    },
    {
        field: "priority",
        headerName: "Prioridad",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
            if (!params.value) return null
            return (
                <Chip
                    label={params.value}
                    color={params.value === 'Alta' ? 'error' : 'default'}
                    size="small"
                />
            )
        }
    },
    {
        field: "actions",
        headerName: "Acciones",
        flex: 1,
        minWidth: 150,
        sortable: false,
        renderCell: (params) => {
            const router = useRouter()
            const { enqueueSnackbar } = useSnackbar()
            const { deleteMutation } = useInterventions()
            const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

            const handleDelete = async () => {
                try {
                    await deleteMutation.mutateAsync(params.row.id)
                    setOpenDeleteDialog(false)
                } catch (error) {
                    enqueueSnackbar(`Error al eliminar: ${error.message}`, { variant: 'error' })
                }
            }

            return (
                <>
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Tooltip title="Ver detalles" arrow>
                            <IconButton
                                size="small"
                                onClick={() => router.push(`/interventions/${params.row.id}`)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <ProtectedResource 
                            entity="INTERVENTION" 
                            operation="UPDATE"
                        >
                            <Tooltip title="Editar" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => router.push(`/interventions/${params.row.id}/edit`)}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </ProtectedResource>
                        <ProtectedResource 
                            entity="INTERVENTION" 
                            operation="DELETE"
                        >
                            <Tooltip title="Eliminar" arrow>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setOpenDeleteDialog(true)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </ProtectedResource>
                    </Box>

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
                </>
            )
        }
    }
]
