import { z } from 'zod';

export const baseSchema = z.object({
  // CLIENTE
  name: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.preprocess(
    (val) => (typeof val === 'string' ? val.replace(/\D/g, '') : undefined),
    z.string().min(10, 'Telefone inválido').optional()
  ),
  cpfOrCnpj: z.preprocess(
    (val) => (typeof val === 'string' ? val.replace(/\D/g, '') : undefined),
    z
      .string()
      .refine(
        (val) => val === undefined || val.length === 11 || val.length === 14,
        {
          message: 'CPF ou CNPJ inválido',
        }
      )
      .optional()
  ),
  address: z.string().optional(),

  // VEÍCULO
  plate: z
    .string()
    .regex(/^[A-Z]{3}-\d{4}$/, 'Formato da placa inválido')
    .optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional()
  ),

  // ORDEM
  km: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional()
  ),
  fuelLevel: z.string().optional(),
  adblueLevel: z.string().optional(),
  tireStatus: z.string().optional(),
  mirrorStatus: z.string().optional(),
  paintingStatus: z.string().optional(),
  complaints: z.string().min(1, 'Reclamações são obrigatórias'),
  notes: z.string().optional(),

  // Controle do fluxo
  createNewClient: z.boolean(),
  selectedVehicleId: z.string().optional(),
});

export const fullSchema = baseSchema.superRefine((data, ctx) => {
  if (data.createNewClient) {
    if (!data.name)
      ctx.addIssue({
        path: ['name'],
        message: 'Nome é obrigatório',
        code: z.ZodIssueCode.custom,
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

  if (!data.selectedVehicleId) {
    if (!data.plate)
      ctx.addIssue({
        path: ['plate'],
        message: 'Placa é obrigatória',
        code: z.ZodIssueCode.custom,
      });
  }
});

export type NovoAtendimentoFormData = z.infer<typeof fullSchema>;
