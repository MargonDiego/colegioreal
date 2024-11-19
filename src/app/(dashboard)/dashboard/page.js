// app/(dashboard)/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { School, Psychology, Group, Warning } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStudents } from '@/hooks/useStudents';
import { useInterventions } from '@/hooks/useInterventions';
import { useUsers } from '@/hooks/useUsers';

export default function DashboardPage() {
  const theme = useTheme();
  const [stats, setStats] = useState({ students: 0, interventions: 0, users: 0, urgentCases: 0 });
  const [interventionsData, setInterventionsData] = useState([]);
  const [interventionTypes, setInterventionTypes] = useState([]);
  const [studentGrades, setStudentGrades] = useState([]);
  const [error, setError] = useState(null);

  const { data: studentsData, isLoading: loadingStudents } = useStudents({ filters: { isActive: true } });
  const { data: interventionsResult, isLoading: loadingInterventions } = useInterventions({ filters: { status: ['Pendiente', 'En Proceso'] } });
  const { data: usersData, isLoading: loadingUsers } = useUsers({ filters: { isActive: true } });

  useEffect(() => {
    if (studentsData?.data && interventionsResult?.data && usersData) {
      setStats({
        students: studentsData.total || studentsData.data.length,
        interventions: interventionsResult.total || interventionsResult.data.length,
        users: usersData.length,
        urgentCases: interventionsResult.data.filter((i) => i.priority === 'Urgente').length,
      });

      setInterventionsData(interventionsResult.data || []);

      const typeCount = interventionsResult.data.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {});
      setInterventionTypes(Object.entries(typeCount).map(([name, value]) => ({ name, value })));

      const gradeOrder = [
        'Pre-Kinder', 'Kinder', '1° Básico', '2° Básico', '3° Básico', '4° Básico',
        '5° Básico', '6° Básico', '7° Básico', '8° Básico', '1° Medio', '2° Medio', '3° Medio', '4° Medio',
      ];
      const gradeCount = studentsData.data.reduce((acc, student) => {
        acc[student.grade] = (acc[student.grade] || 0) + 1;
        return acc;
      }, {});
      setStudentGrades(
          Object.entries(gradeCount)
              .sort((a, b) => gradeOrder.indexOf(a[0]) - gradeOrder.indexOf(b[0]))
              .map(([grade, count]) => ({ grade, count }))
      );
    }
  }, [studentsData, interventionsResult, usersData]);

  return (
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 4 }}>
          Panel de Control
        </Typography>

        {loadingStudents || loadingInterventions || loadingUsers ? (
            <CircularProgress />
        ) : (
            <>
              <Grid container spacing={3}>
                {/* Estadísticas Generales */}
                {[
                  { title: 'Total Estudiantes', value: stats.students, icon: <School />, color: theme.palette.primary.main },
                  { title: 'Intervenciones Activas', value: stats.interventions, icon: <Psychology />, color: theme.palette.warning.main },
                  { title: 'Usuarios Activos', value: stats.users, icon: <Group />, color: theme.palette.success.main },
                  { title: 'Casos Urgentes', value: stats.urgentCases, icon: <Warning />, color: theme.palette.error.main },
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4], backgroundColor: theme.palette.background.paper }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography color="textSecondary" gutterBottom>{stat.title}</Typography>
                              <Typography variant="h4">{stat.value}</Typography>
                            </Box>
                            <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                ))}
              </Grid>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Intervenciones Recientes */}
                <Grid item xs={12} md={8}>
                  <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                    <CardHeader title="Intervenciones Recientes" />
                    <CardContent>
                      <List>
                        {interventionsData.map((intervention) => (
                            <ListItem divider key={intervention.id}>
                              <ListItemText
                                  primary={intervention.title}
                                  secondary={`${intervention.student?.firstName} ${intervention.student?.lastName} - ${new Date(intervention.dateReported).toLocaleDateString()}`}
                              />
                              <Chip label={intervention.status} color="primary" size="small" />
                              <Chip label={intervention.priority} color="secondary" size="small" />
                            </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Gráfico de Tipos de Intervención */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                    <CardContent>
                      <Typography variant="h6">Intervenciones por Tipo</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={interventionTypes}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill={theme.palette.primary.main} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Gráfico de Estudiantes por Grado */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                    <CardContent>
                      <Typography variant="h6">Estudiantes por Grado</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={studentGrades}>
                          <XAxis dataKey="grade" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill={theme.palette.secondary.main} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
        )}
      </Container>
  );
}
