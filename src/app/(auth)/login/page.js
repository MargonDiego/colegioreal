// src/app/(auth)/login/page.js
'use client'

import { Box, Container, Paper } from '@mui/material'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%'
                    }}
                >
                    <LoginForm />
                </Paper>
            </Box>
        </Container>
    )
}