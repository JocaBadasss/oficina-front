// helpers/orders.ts

export function formatKmForDisplay(
  input: string | number | null | undefined
): string {
  if (!input) return '';

  const raw =
    typeof input === 'number'
      ? input
      : Number(input.toString().replace(/\D/g, ''));
  if (isNaN(raw)) return '';

  return raw.toLocaleString('pt-BR');
}

/**
 * Extrai apenas os números de uma string, retornando como número puro.
 */
export function parseKmInput(input: string): number {
  return Number(input.replace(/\D/g, ''));
}
