import { mask } from 'remask';

export function formatCpfOrCnpj(value: string | null | undefined): string {
  if (!value) return '—';

  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return mask(cleaned, '999.999.999-99');
  }

  if (cleaned.length === 14) {
    return mask(cleaned, '99.999.999/9999-99');
  }

  return value; // fallback bruto caso venha com valor estranho
}

export function formatPhoneInput(value: string): string {
  return mask(value.replace(/\D/g, ''), ['(99) 99999-9999']);
}

export function formatCpfCnpjInput(value: string): string {
  const raw = value.replace(/\D/g, '');
  return raw.length <= 11
    ? mask(raw, ['999.999.999-99'])
    : mask(raw, ['99.999.999/9999-99']);
}
