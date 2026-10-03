# Scanner test codes

Open `index.html` in a browser to view or print all six codes. Individual PNGs can also be opened at full size. All six images were decoded and checked against their expected values.

- `samsung-code128.png`: Code 128, `8806094948631`. Matches the Samsung TV in seed_mock_data.py when seeded.
- `sony-code128.png`: Code 128, `4548736132580`. Matches the Sony headphones in seed_mock_data.py when seeded.
- `test-code128.png`: Code 128, `WK-TEST-001`. Synthetic test value; save a product with this barcode to test local lookup.
- `test-ean13.png`: EAN-13, `5901234123457`. Valid EAN-13 checksum; external lookup results may vary.
- `samsung-qr.png`: QR, `8806094948631`. Same seeded Samsung TV value, encoded as QR.
- `test-qr.png`: QR, `WK-TEST-001`. Same synthetic test value, encoded as QR.

Save a product with barcode `WK-TEST-001`, then scan either test-code128.png or test-qr.png to verify local product prefill. Before saving a matching product, the synthetic value should allow manual entry.

## Embedded product QR codes

Use product-tv-qr.png, product-laptop-qr.png, or product-headphones-qr.png to import details without lookup or sample data. The corresponding JSON files show their payloads. Category names match existing categories; select a category if no match exists. Review the prefilled form and click Save Product to persist the data.
