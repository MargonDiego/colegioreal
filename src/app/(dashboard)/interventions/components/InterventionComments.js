'use client'

import { useState } from 'react'
import { 
    Box, 
    TextField, 
    Button, 
    Select, 
    MenuItem, 
    FormControl,
    Avatar,
    Typography
} from '@mui/material'
import { AttachFile as AttachFileIcon, Person as PersonIcon } from '@mui/icons-material'
import { useComments } from '@/hooks/useComments'
import useAuthStore from '@/hooks/useAuth'
import CommentList from './CommentList'

export default function InterventionComments({ interventionId }) {
    const [newComment, setNewComment] = useState('')
    const [commentType, setCommentType] = useState('Seguimiento')
    const [isPrivate, setIsPrivate] = useState(false)
    const [editingComment, setEditingComment] = useState(null)
    const [evidencias, setEvidencias] = useState([])
    const { user } = useAuthStore()

    const {
        data: commentsData,
        createComment,
        updateComment,
        deleteComment,
        isLoading,
        commentTypes
    } = useComments(interventionId)

    const handleSubmit = async () => {
        if (!newComment.trim()) return

        const commentData = {
            content: newComment,
            tipo: commentType,
            isPrivate,
            evidencias,
            interventionId,
            userId: user.id // Agregamos el ID del usuario actual
        }

        try {
            if (editingComment) {
                // Permitir editar si es el autor del comentario o es admin
                if (editingComment.user?.id !== user.id && user.role !== 'Admin') {
                    console.error('No tienes permiso para editar este comentario')
                    return
                }
                await updateComment(editingComment.id, commentData)
            } else {
                await createComment(commentData)
            }
            setNewComment('')
            setEditingComment(null)
            setEvidencias([])
        } catch (error) {
            console.error('Error al guardar el comentario:', error)
        }
    }

    const handleEditComment = (comment) => {
        // Solo permitir editar si es el autor del comentario
        if (comment.user?.id !== user.id) {
            console.error('No tienes permiso para editar este comentario')
            return
        }

        setEditingComment(comment)
        setNewComment(comment.content)
        setCommentType(comment.tipo)
        setIsPrivate(comment.isPrivate)
        setEvidencias(comment.evidencias || [])
    }

    const handleDeleteComment = async (commentId, userId) => {
        // Permitir eliminar si es el autor del comentario o es admin
        if (userId !== user.id && user.role !== 'Admin') {
            console.error('No tienes permiso para eliminar este comentario')
            return
        }
        try {
            await deleteComment(commentId)
        } catch (error) {
            console.error('Error al eliminar el comentario:', error)
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3 }}>
                {/* Mostrar información del usuario actual */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                        <PersonIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {user?.staffType && (
                                <Typography variant="caption" 
                                    sx={{ 
                                        backgroundColor: 'grey.100',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        color: 'text.secondary'
                                    }}>
                                    {user.staffType}
                                </Typography>
                            )}
                            {user?.department && (
                                <Typography variant="caption"
                                    sx={{ 
                                        backgroundColor: 'grey.100',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        color: 'text.secondary'
                                    }}>
                                    {user.department}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Nuevo Comentario"
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={commentType}
                            onChange={(e) => setCommentType(e.target.value)}
                            displayEmpty
                            sx={{ '& .MuiSelect-select': { py: 1 } }}
                        >
                            {commentTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="inherit"
                        size="small"
                        startIcon={<AttachFileIcon />}
                        sx={{ bgcolor: 'grey.200', color: 'text.primary' }}
                    >
                        Adjuntar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {editingComment ? 'Actualizar' : 'Agregar'}
                    </Button>
                </Box>
            </Box>

            <CommentList 
                comments={commentsData?.data} 
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                currentUserId={user.id}
                user={user}
            />
        </Box>
    )
}
