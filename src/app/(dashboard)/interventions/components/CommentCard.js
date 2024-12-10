'use client'

import { Box, Typography, IconButton, Chip, Avatar, Paper } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import ProtectedResource from '@/components/auth/ProtectedResource'

const formatDate = (date) => {
    return format(new Date(date), 'dd \'de\' MMMM \'de\' yyyy HH:mm', { locale: es })
}

export default function CommentCard({ comment, onEdit, onDelete, currentUserId, user }) {
    // Si no hay comentario, no renderizar nada
    if (!comment) return null

    // Verificar si el usuario actual es el autor del comentario
    const isAuthor = currentUserId === comment.user?.id

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 2,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': {
                    backgroundColor: 'grey.50'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                        <PersonIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {comment.user?.firstName || 'Usuario'} {comment.user?.lastName || ''}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5, mb: 1 }}>
                            {comment.user?.staffType && (
                                <Typography variant="caption" 
                                    sx={{ 
                                        backgroundColor: 'grey.100',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        color: 'text.secondary'
                                    }}>
                                    {comment.user.staffType}
                                </Typography>
                            )}
                            {comment.user?.department && (
                                <Typography variant="caption" color="text.secondary">
                                    {comment.user.department}
                                </Typography>
                            )}
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                            {comment.content}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(comment.createdAt)}
                            </Typography>
                            <Chip 
                                label={comment.tipo} 
                                size="small"
                                sx={{ 
                                    bgcolor: 'grey.100',
                                    height: '24px'
                                }}
                            />
                            {comment.evidencias?.map((evidencia, index) => (
                                <Chip
                                    key={index}
                                    label={evidencia.name}
                                    size="small"
                                    sx={{ bgcolor: 'primary.50' }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
                {/* Mostrar botones si el usuario es autor O es admin */}
                {(isAuthor || user?.role === 'Admin') && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <ProtectedResource entity="COMMENT" operation="UPDATE">
                            <IconButton size="small" onClick={() => onEdit(comment)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </ProtectedResource>
                        <ProtectedResource entity="COMMENT" operation="DELETE">
                            <IconButton size="small" onClick={() => onDelete(comment.id, comment.user?.id)} color="error">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </ProtectedResource>
                    </Box>
                )}
            </Box>
        </Paper>
    )
}
