// app/layout.js
import AppProviders from '@/components/providers/AppProviders'

export default function RootLayout({ children }) {
    return (
        <html lang="es">
        <body>
        <AppProviders>
            {children}
        </AppProviders>
        </body>
        </html>
    )
}