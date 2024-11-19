import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    useTheme,
    alpha,
    Fade,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import ProtectedResource from '@/components/auth/ProtectedResource';

export default function StudentsTable({ students, loading, onViewStudent }) {
    const theme = useTheme();

    if (loading) {
        return (
            <Fade in={true} style={{ transitionDelay: '300ms' }}>
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    Cargando estudiantes...
                </Typography>
            </Fade>
        );
    }

    if (!students || students.length === 0) {
        return (
            <Fade in={true} style={{ transitionDelay: '300ms' }}>
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No hay estudiantes disponibles.
                </Typography>
            </Fade>
        );
    }

    const handleViewDetails = (id) => {
        window.location.href = `/students/${id}`;
    };

    const handleEdit = (id) => {
        window.location.href = `/students/${id}/edit`;
    };

    const handleDelete = (id) => {
        console.log(`Eliminar estudiante con ID: ${id}`);
    };

    return (
        <Fade in={true} style={{ transitionDelay: '150ms' }}>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    boxShadow: theme.shadows[8],
                    backgroundColor: theme.palette.background.paper,
                    overflow: 'hidden',
                    '&:hover': {
                        boxShadow: theme.shadows[12],
                        transition: theme.transitions.create('box-shadow', {
                            duration: theme.transitions.duration.short,
                        }),
                    },
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? alpha(theme.palette.primary.main, 0.7)
                                    : alpha(theme.palette.primary.light, 0.7),
                            }}
                        >
                            {['Nombre', 'RUT', 'Email', 'Grado', 'Acciones'].map((header, index) => (
                                <TableCell key={index}>
                                    <Typography color="textPrimary" variant="subtitle1" fontWeight="bold">
                                        {header}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student, index) => (
                            <Fade key={student.id} in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                                <TableRow
                                    sx={{
                                        backgroundColor: theme.palette.background.default,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.action.hover, 0.1),
                                            transition: theme.transitions.create('background-color', {
                                                duration: theme.transitions.duration.shortest,
                                            }),
                                        },
                                        '&:active': {
                                            backgroundColor: alpha(theme.palette.action.selected, 0.1),
                                        },
                                    }}
                                >
                                    <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'medium' }}>
                                        {`${student.firstName} ${student.lastName}`}
                                    </TableCell>
                                    <TableCell sx={{ color: theme.palette.text.secondary }}>{student.rut}</TableCell>
                                    <TableCell sx={{ color: theme.palette.text.secondary }}>{student.email}</TableCell>
                                    <TableCell sx={{ color: theme.palette.text.secondary }}>{student.grade}</TableCell>
                                    <TableCell>
                                        <ProtectedResource entity="student" operation="UPDATE">
                                            <Tooltip title="Editar" arrow>
                                                <IconButton
                                                    sx={{
                                                        color: theme.palette.primary.main,
                                                        '&:hover': {
                                                            color: theme.palette.primary.dark,
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        },
                                                    }}
                                                    onClick={() => handleEdit(student.id)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                        </ProtectedResource>
                                        <ProtectedResource entity="student" operation="DELETE">
                                            <Tooltip title="Eliminar" arrow>
                                                <IconButton
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        '&:hover': {
                                                            color: theme.palette.error.dark,
                                                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                        },
                                                    }}
                                                    onClick={() => handleDelete(student.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </ProtectedResource>
                                        <ProtectedResource entity="student" operation="READ">
                                            <Tooltip title="Ver Detalles" arrow>
                                                <IconButton
                                                    sx={{
                                                        color: theme.palette.info.main,
                                                        '&:hover': {
                                                            color: theme.palette.info.dark,
                                                            backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                        },
                                                    }}
                                                    onClick={() => onViewStudent(student.id)}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                        </ProtectedResource>
                                    </TableCell>
                                </TableRow>
                            </Fade>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fade>
    );
}