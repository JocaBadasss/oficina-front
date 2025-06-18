'use client';

import { Stepper, Step, StepLabel } from '@mui/material';

interface StepperMUIProps {
  currentStatus: string;
}

const steps = ['AGUARDANDO', 'EM ANDAMENTO', 'FINALIZADO'];

export function StepperMUI({ currentStatus }: StepperMUIProps) {
  const normalizedStatus = currentStatus?.trim().toUpperCase();
  const stepIndex = steps.findIndex(
    (s) => s.replace(' ', '_') === normalizedStatus
  );
  const isFinalizado = normalizedStatus === 'FINALIZADO';

  return (
    <div className='w-full max-w-lg mx-auto'>
      <Stepper
        activeStep={isFinalizado ? -1 : stepIndex}
        alternativeLabel
        sx={{
          '& .MuiStepIcon-root': {
            color: 'hsl(var(--accent))', // inativo
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: isFinalizado
              ? 'hsl(var(--success))'
              : 'hsl(var(--tertiary))',
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: 'hsl(var(--success))',
          },
          '& .MuiStepLabel-label': {
            color: 'hsl(var(--placeholder))',
            fontWeight: 500,
            fontFamily: 'Poppins',
          },
          '& .MuiStepLabel-label.Mui-active': {
            color: isFinalizado
              ? 'hsl(var(--success))'
              : 'hsl(var(--tertiary))',
            fontWeight: 600,
          },
          '& .MuiStepLabel-label.Mui-completed': {
            color: 'hsl(var(--soft-foreground))',
          },
          '& .MuiStepIcon-text': {
            fill: 'hsl(var(--foreground))', // ou outra cor que quiser
            fontWeight: 600,
          },
        }}
      >
        {steps.map((label, index) => (
          <Step
            key={label}
            completed={isFinalizado || index < stepIndex}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

export default StepperMUI;
