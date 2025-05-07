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
            color: '#192227', // DARK_600
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: isFinalizado ? '#04D361' : '#FBA94C',
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: '#04D361',
          },
          '& .MuiStepLabel-label': {
            color: '#7C7C8A', // LIGHT_500
            fontWeight: 500,
            fontFamily: 'Poppins',
          },
          '& .MuiStepLabel-label.Mui-active': {
            color: isFinalizado ? '#04D361' : '#FBA94C',
            fontWeight: 600,
          },
          '& .MuiStepLabel-label.Mui-completed': {
            color: '#E1E1E6', // LIGHT_300
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
