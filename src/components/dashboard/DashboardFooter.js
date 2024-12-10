import { Box, Typography, Stack } from '@mui/material';

export default function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                px: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                boxSizing: 'border-box',
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                backgroundColor: (theme) => theme.palette.background.paper,
            }}
        >
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                divider={
                    <Box
                        component="span"
                        sx={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: 'text.secondary',
                            opacity: 0.7
                        }}
                    />
                }
            >
                <Typography variant="body2" color="text.secondary">
                    {currentYear} Colegio Real
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Todos los derechos reservados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Versión 1.0.0
                </Typography>
            </Stack>
        </Box>
    );
}
