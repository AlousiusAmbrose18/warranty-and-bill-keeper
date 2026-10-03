import { describe, expect, it } from 'vitest';
import { parseProductQr } from './productQr';
import { prefillToFormValues, toProductRequest } from './productSchema';

describe('product QR import', () => {
  it('carries embedded details through to the save request', () => {
    const product = { name: 'Test TV', brand: 'Acme', modelNumber: 'TV1', serialNumber: 'SN1', barcode: 'WK-001', categoryId: 1, purchaseDate: '2026-10-01', purchasePrice: 0, warrantyPeriod: 2, warrantyPeriodUnit: 'YEARS', warrantyExpiryDate: '2028-10-01', storeSeller: 'Test store', notes: 'Imported' };
    expect(toProductRequest(prefillToFormValues(parseProductQr(JSON.stringify(product))!))).toEqual(product);
  });
  it('preserves category names for matching and does not save JSON as the barcode', () => {
    expect(parseProductQr('{"name":"TV","categoryName":"Electronics"}')).toEqual({ name: 'TV', categoryName: 'Electronics' });
  });
  it('keeps ordinary codes on the lookup path', () => {
    expect(parseProductQr('8806094948631')).toBeNull();
    expect(parseProductQr('WK-TEST-001')).toBeNull();
  });
  it.each(['{broken', '{"brand":"Acme"}', '{"name":"TV","purchaseDate":"2026-02-30"}', '{"name":"TV","purchasePrice":-1}', '{"name":"TV","warrantyPeriod":2}', '{"name":"TV","purchaseDate":"2026-10-01","warrantyExpiryDate":"2026-09-01"}'])('rejects invalid product data: %s', (value) => {
    expect(() => parseProductQr(value)).toThrow();
  });
});
