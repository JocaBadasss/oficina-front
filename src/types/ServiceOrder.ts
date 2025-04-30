// src/types/ServiceOrder.ts
export interface ServiceOrder {
  id: string;
  vehicleId: string;
  fuelLevel: 'RESERVA' | 'QUARTO' | 'METADE' | 'TRES_QUARTOS' | 'CHEIO';
  adblueLevel: 'VAZIO' | 'BAIXO' | 'METADE' | 'CHEIO';
  km: number;
  tireStatus: 'RUIM' | 'REGULAR' | 'BOM' | 'NOVO';
  mirrorStatus: 'OK' | 'QUEBRADO' | 'RACHADO' | 'FALTANDO';
  paintingStatus: 'INTACTA' | 'ARRANHADA' | 'AMASSADA' | 'REPARADA';
  complaints: string;
  notes: string;
  status: 'AGUARDANDO' | 'EM_ANDAMENTO' | 'FINALIZADO';
  createdAt: string; // ou Date, se for convertido
  updatedAt: string; // ou Date
  vehicle: {
    plate: string;
    brand: string;
    model: string;
    year: number;
    client: {
      name: string;
    };
  };
}
