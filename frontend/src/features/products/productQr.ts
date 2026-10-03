import { z } from 'zod';
import type { ProductPrefill } from '../../types/product';

const text = (max: number) => z.string().trim().max(max).optional();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, 'Invalid calendar date').optional();
const schema = z.object({
  name: z.string().trim().min(1).max(200),
  brand: text(100), modelNumber: text(100), serialNumber: text(100), barcode: text(100),
  categoryId: z.number().int().positive().optional(), categoryName: text(100),
  purchaseDate: date, purchasePrice: z.number().finite().nonnegative().optional(),
  warrantyPeriod: z.number().int().positive().optional(),
  warrantyPeriodUnit: z.enum(['MONTHS', 'YEARS']).optional(), warrantyExpiryDate: date,
  storeSeller: text(150), notes: text(1000),
}).superRefine((value, ctx) => {
  if (value.warrantyPeriod && !value.warrantyPeriodUnit) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['warrantyPeriodUnit'], message: 'Required with warrantyPeriod' });
  }
  if (value.purchaseDate && value.warrantyExpiryDate && value.warrantyExpiryDate < value.purchaseDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['warrantyExpiryDate'], message: 'Must be on or after purchaseDate' });
  }
});

/** Plain codes use lookup; JSON QR codes carry product fields directly. */
export function parseProductQr(value: string): ProductPrefill | null {
  if (!value.trim().startsWith('{')) return null;
  let data: unknown;
  try { data = JSON.parse(value); } catch { throw new Error('QR product data must contain valid JSON.'); }
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid QR product data: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  return parsed.data;
}
