import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Appointment } from '@/types/Appointment';
import { ServiceOrder } from '@/types/ServiceOrder';

interface DashboardData {
  loading: boolean;
  appointments: Appointment[];
  openOrders: ServiceOrder[];
  totalAppointmentsToday: number;
  totalOpenOrders: number;
}

export function useDashboardData(): DashboardData {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [appointmentsRes, ordersRes] = await Promise.all([
        api.get<Appointment[]>('/appointments'),
        api.get<ServiceOrder[]>('/service-orders'),
      ]);
      setAppointments(appointmentsRes.data);
      setOrders(ordersRes.data);
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
  };
}
