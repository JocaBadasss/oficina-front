// src/types/Appointment.ts
export interface Appointment {
  id: string;
  vehicleId: string;
  date: string;
  status: string;
  notes: string;
  createdAt: string;
  vehicle: {
    plate: string;
    brand: string;
    model: string;
    client: {
      name: string;
    };
  };
}
