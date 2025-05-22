import { z } from 'zod';

export const baseSchema = z.object({
  clientId: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.preprocess(
    (val) => (typeof val === 'string' ? val.replace(/\D/g, '') : undefined),
    z.string().min(10, 'Telefone inválido').optional()
  ) as z.ZodType<string | undefined>,

  cpfOrCnpj: z.preprocess(
    (val) => (typeof val === 'string' ? val.replace(/\D/g, '') : undefined),
    z
      .string()
      .refine((val) => !val || val.length === 11 || val.length === 14, {
        message: 'CPF ou CNPJ inválido',
      })
      .optional()
  ) as z.ZodType<string | undefined>,

  address: z.string().optional(),
  plate: z
    .string()
    .min(7, 'Placa inválida')
    .refine(
      (val) => {
        const raw = val.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        return (
          /^[A-Z]{3}[0-9]{4}$/.test(raw) || // Antiga sem hífen
          /^[A-Z]{3}-[0-9]{4}$/.test(val) || // Antiga com hífen (visual)
          /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(raw) // Mercosul
        );
      },
      {
        message: 'Formato de placa inválido',
      }
    ),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional()
  ) as z.ZodType<number | undefined>,
  km: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional()
  ) as z.ZodType<number | undefined>,
  fuelLevel: z.string().optional(),
  adblueLevel: z.string().optional(),
  tireStatus: z.string().optional(),
  mirrorStatus: z.string().optional(),
  paintingStatus: z.string().optional(),
  complaints: z.string().min(1, 'Reclamações são obrigatórias'),
  notes: z.string().optional(),
  createNewClient: z.boolean(),
  selectedVehicleId: z.string().optional(),
});

export const fullSchema = baseSchema.superRefine((data, ctx) => {
  if (data.createNewClient) {
    if (!data.name)
      ctx.addIssue({
        path: ['name'],
        message: 'Nome é obrigatório',
        code: z.ZodIssueCode.custom, // <--- Faltou isso
      });
    if (!data.email)
      ctx.addIssue({
        path: ['email'],
        message: 'Email é obrigatório',
        code: z.ZodIssueCode.custom,
      });
    if (!data.phone)
      ctx.addIssue({
        path: ['phone'],
        message: 'Telefone é obrigatório',
        code: z.ZodIssueCode.custom,
      });
    if (!data.cpfOrCnpj)
      ctx.addIssue({
        path: ['cpfOrCnpj'],
        message: 'CPF/CNPJ é obrigatório',
        code: z.ZodIssueCode.custom,
      });
  }

  if (!data.selectedVehicleId && !data.plate) {
    ctx.addIssue({
      path: ['plate'],
      message: 'Placa é obrigatória',
      code: z.ZodIssueCode.custom,
    });
  }

  if (!data.createNewClient && !data.clientId) {
    ctx.addIssue({
      path: ['clientId'],
      message: 'Você deve selecionar um cliente',
      code: z.ZodIssueCode.custom,
    });
  }
});

export type NovoAtendimentoFormData = z.infer<typeof fullSchema>;
