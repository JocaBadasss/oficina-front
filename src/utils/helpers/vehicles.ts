export function formatPlate(plate: string) {
  const upper = plate.toUpperCase();

  // Formato antigo: ABC1234 → ABC-1234
  if (/^[A-Z]{3}[0-9]{4}$/.test(upper)) {
    return `${upper.slice(0, 3)}-${upper.slice(3)}`;
  }

  // Placa Mercosul ou desconhecida → mostrar como está (uppercase)
  return upper;
}

export function formatVehicleInfo(
  model?: string | null,
  brand?: string | null,
  year?: number | null
) {
  const modelPart = model?.trim() || '—';
  const brandPart = brand?.trim() ? ` (${brand.trim()})` : '';
  const yearPart = year || '—';

  return `${modelPart}${brandPart} - ${yearPart}`;
}

// src/utils/helpers/vehicles.ts

export function formatVehicleLine({
  plate,
  model,
  brand,
}: {
  plate: string;
  model?: string | null;
  brand?: string | null;
}) {
  const parts: string[] = [];

  if (plate) parts.push(smartFormatPlate(plate));

  if (model?.trim()) parts.push(model.trim());

  if (brand?.trim()) {
    if (model?.trim()) {
      parts[parts.length - 1] += ` (${brand.trim()})`;
    } else {
      parts.push(`(${brand.trim()})`);
    }
  }

  return parts.join(' — ');
}
// src/utils/helpers/vehicles.ts

export function formatModelBrand(
  model?: string | null,
  brand?: string | null
): string {
  const trimmedModel = model?.trim();
  const trimmedBrand = brand?.trim();

  const hasModel = !!trimmedModel;
  const hasBrand = !!trimmedBrand;

  if (hasModel && hasBrand) {
    return `${trimmedModel} (${trimmedBrand})`;
  }

  if (hasModel) return trimmedModel;
  if (hasBrand) return `(${trimmedBrand})`;

  return '—';
}

export function smartFormatPlate(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Se digitação ultrapassa 7 caracteres, corta
  const sliced = raw.slice(0, 7);

  // Se começa com 3 letras e os dois seguintes são números → placa antiga
  if (/^[A-Z]{3}[0-9]{2}/.test(sliced)) {
    return `${sliced.slice(0, 3)}-${sliced.slice(3)}`;
  }

  // Se parecer Mercosul → mantém cru (máximo 7 chars, uppercase)
  if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(sliced)) {
    return sliced;
  }

  // Se não bater nenhum padrão, mantém apenas os válidos (sem formatar)
  return sliced;
}
