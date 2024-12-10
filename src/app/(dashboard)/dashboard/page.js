// app/(dashboard)/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
  Box,
  Button,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Chip,
  ListItemText,
  Container
} from '@mui/material';
import { 
  Person,
  School,
  Psychology,
  Group,
  Warning
} from '@mui/icons-material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useStudents } from '@/hooks/useStudents';
import { useInterventions } from '@/hooks/useInterventions';
import { useUsers } from '@/hooks/useUsers';
import { useComments } from '@/hooks/useComments';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const theme = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState({ students: 0, interventions: 0, users: 0, urgentCases: 0 });
  const [interventionsData, setInterventionsData] = useState([]);
  const [interventionTypes, setInterventionTypes] = useState([]);
  const [studentGrades, setStudentGrades] = useState([]);
  const [error, setError] = useState(null);
  const [recentComments, setRecentComments] = useState([]);

  const { data: studentsData, isLoading: loadingStudents } = useStudents({ filters: { isActive: true } });
  const { data: interventionsResult, isLoading: loadingInterventions } = useInterventions({
    pagination: {
      page: 1,
      limit: 1000 // Un número grande para asegurar que traiga todas las intervenciones
    }
  });
  const { data: commentsData, isLoading: loadingComments } = useComments(null, {
    pagination: {
      page: 1,
      limit: 5
    }
  });
  const { data: usersData, isLoading: loadingUsers } = useUsers({ filters: { isActive: true } });

  useEffect(() => {
    console.log('interventionsResult:', interventionsResult);
    console.log('studentsData:', studentsData);
    console.log('usersData:', usersData);
    console.log('commentsData:', commentsData);

    if (studentsData?.data && interventionsResult?.data && usersData && commentsData) {
      // Filtrar solo para las estadísticas de casos activos
      const activeInterventions = interventionsResult.data.filter(
        i => i.status === 'Pendiente' || i.status === 'En Proceso'
      );

      // Usar todas las intervenciones para los gráficos y conteos totales
      const allInterventions = interventionsResult.data;

      setStats({
        students: studentsData.total || studentsData.data.length,
        interventions: activeInterventions.length,
        users: usersData.length,
        urgentCases: allInterventions.filter((i) => i.priority === 'Urgente').length,
      });

      // Usar intervenciones activas para la lista
      setInterventionsData(activeInterventions);

      // Usar todas las intervenciones para el gráfico de tipos
      const typeCount = allInterventions.reduce((acc, item) => {
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

      // Set recent comments
      if (commentsData?.data) {
        setRecentComments(commentsData.data);
      }
    }
  }, [studentsData, interventionsResult, usersData, commentsData]);

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
            {[/* ... */].map((stat, index) => (
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
            {/* Intervenciones Activas */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                <CardHeader
                  title="Intervenciones Activas"
                  action={
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => router.push('/interventions')}
                    >
                      Ver todas
                    </Button>
                  }
                />
                <CardContent>
                  <List>
                    {interventionsData.slice(0, 5).map((intervention) => (
                      <ListItem
                        divider
                        key={intervention.id}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => router.push(`/interventions/${intervention.id}`)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Avatar
                            sx={{
                              bgcolor: intervention.priority === 'Urgente' ? 'error.main' : 'primary.main',
                              mr: 2
                            }}
                          >
                            <Psychology />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              {intervention.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {`${intervention.student?.firstName} ${intervention.student?.lastName} - ${new Date(intervention.dateReported).toLocaleDateString()}`}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={intervention.status}
                              color={intervention.status === 'Pendiente' ? 'warning' : 'primary'}
                              size="small"
                            />
                            <Chip
                              label={intervention.priority}
                              color={intervention.priority === 'Urgente' ? 'error' : 'default'}
                              size="small"
                            />
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Últimos Comentarios */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                <CardHeader 
                  title="Últimos Comentarios" 
                  action={
                    <Button 
                      size="small" 
                      color="primary" 
                      onClick={() => router.push('/interventions')}
                    >
                      Ver todos
                    </Button>
                  }
                />
                <CardContent>
                  <List>
                    {loadingComments ? (
                      <CircularProgress size={20} />
                    ) : commentsData?.data?.length > 0 ? (
                      commentsData.data.map((comment) => (
                        <ListItem 
                          key={comment.id}
                          divider
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                          onClick={() => router.push(`/interventions/${comment.intervention?.id}`)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 1,
                                bgcolor: 'primary.main' 
                              }}
                            >
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {comment.user?.firstName} {comment.user?.lastName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {comment.content}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" align="center">
                        No hay comentarios recientes
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Gráfico de Estudiantes por Grado */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                <CardHeader title="Distribución de Estudiantes por Grado" />
                <CardContent>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={studentGrades}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill={theme.palette.primary.main} name="Estudiantes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Tipos de Intervenciones */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
                <CardHeader title="Tipos de Intervenciones" />
                <CardContent>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={interventionTypes} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill={theme.palette.warning.main} name="Cantidad" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
