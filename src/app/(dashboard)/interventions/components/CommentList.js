'use client'

import { Box, Typography, List } from '@mui/material'
import CommentCard from './CommentCard'

export default function CommentList({ comments = [], onEditComment, onDeleteComment, currentUserId, user }) {
    // Log para ver los comentarios recibidos
    console.log('CommentList - comments recibidos:', comments)

    if (!comments || comments.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                No hay comentarios para esta intervención
            </Typography>
        )
    }

    return (
        <List sx={{ p: 0 }}>
            {comments.map((comment) => {
                // Log para ver cada comentario individual
                console.log('CommentList - comentario individual:', comment)
                return (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        onEdit={onEditComment}
                        onDelete={onDeleteComment}
                        currentUserId={currentUserId}
                        user={user}
                    />
                )
            })}
        </List>
    )
}
