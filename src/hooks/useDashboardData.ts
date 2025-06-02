import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Appointment } from '@/types/Appointment';
import { ServiceOrder } from '@/types/ServiceOrder';
import { Client } from '@/types/Clients';
import { ServiceOrderStats } from '@/types/ServiceOrderStats';
import { MonthlyServiceOrderStat } from '@/types/MonthlyServiceOrderStat';

interface DashboardData {
  loading: boolean;
  appointments: Appointment[];
  openOrders: ServiceOrder[];
  totalAppointmentsToday: number;
  totalOpenOrders: number;
  totalClients: number;
  stats: ServiceOrderStats;
  monthlyStats: MonthlyServiceOrderStat[];
}

export function useDashboardData(): DashboardData {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ServiceOrderStats>({
    open: 0,
    closed: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState<MonthlyServiceOrderStat[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/service-orders/stats').catch((err) => {
      console.error(
        'Erro na rota de stats:',
        err.response?.data || err.message
      );
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [
        appointmentsRes,
        ordersRes,
        clientsRes,
        statsRes,
        monthlyStatsRes,
      ] = await Promise.all([
        api.get<Appointment[]>('/appointments'),
        api.get<ServiceOrder[]>('/service-orders'),
        api.get<Client[]>('/clients'),
        api.get<ServiceOrderStats>('/service-orders/stats'),
        api.get<MonthlyServiceOrderStat[]>('/service-orders/stats/monthly'),
      ]);
      setAppointments(appointmentsRes.data);
      setOrders(ordersRes.data);
      setClients(clientsRes.data);
      setStats(statsRes.data);
      setMonthlyStats(monthlyStatsRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  const openOrders = orders.filter((o) => o.status !== 'FINALIZADO');

  const now = new Date();

  const upcomingAppointments = appointments.filter((a) => {
    const apptDate = new Date(a.date);
    return (
      a.status === 'PENDENTE' && apptDate >= new Date(now.setHours(0, 0, 0, 0))
    );
  });

  return {
    loading,
    appointments: upcomingAppointments,
    openOrders,
    totalAppointmentsToday: upcomingAppointments.length,
    totalOpenOrders: openOrders.length,
    totalClients: clients.length,
    stats,
    monthlyStats,
  };
}
