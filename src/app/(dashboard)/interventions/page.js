'use client'

import { useState, useEffect } from 'react'
import {
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from "next/navigation"
import { columns } from "./columns"
import { useInterventions } from '@/hooks/useInterventions'

export default function InterventionsPage() {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    })
    
    const { data, isLoading, error } = useInterventions({
        pagination: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize
        }
    })

    useEffect(() => {
        if (data) {
            console.log('Data structure:', {
                interventions: data?.data,
                total: data?.total,
                page: data?.page,
                limit: data?.limit
            })
        }
    }, [data])

    const router = useRouter()

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">Error al cargar las intervenciones</Typography>
            </Box>
        )
    }

    // Los datos vienen en data.data
    const interventions = data?.data || []
    const totalRows = data?.total || 0

    return (
        <Box sx={{ p: 3 , pt: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Intervenciones
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/interventions/new')}
                >
                    Nueva Intervención
                </Button>
            </Box>

            <Paper elevation={1}>
                <DataGrid
                    rows={interventions}
                    columns={columns}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    autoHeight
                    paginationMode="server"
                    loading={isLoading}
                    getRowId={(row) => row.id}
                    sx={{ 
                        minHeight: 400,
                        '& .MuiDataGrid-cell': {
                            padding: '8px'
                        }
                    }}
                />
            </Paper>
        </Box>
    )
}
