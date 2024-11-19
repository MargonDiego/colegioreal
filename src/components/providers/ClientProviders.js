// src/components/providers/ClientProviders.js
'use client'

import { SnackbarProvider } from 'notistack'

export default function ClientProviders({ children }) {

    return (

            <SnackbarProvider maxSnack={3}>
                {children}
            </SnackbarProvider>

    )
}