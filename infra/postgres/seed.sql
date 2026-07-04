INSERT INTO accounts (balance) VALUES (50000.00);

INSERT INTO assets (name, price) VALUES
  ('PETR4', 38.50), ('VALE3', 68.20), ('ITUB4', 32.10),
  ('BBDC4', 15.80), ('ABEV3', 12.30), ('WEGE3', 42.90),
  ('RENT3', 55.60), ('MGLU3',  2.40), ('LREN3', 18.70),
  ('BBAS3', 56.40);

INSERT INTO orders (account_id, asset_id, type, quantity, status, transaction_id)
SELECT
    1,
    (floor(random() * 10) + 1)::int,
    CASE WHEN random() > 0.5 THEN 'buy' ELSE 'sell' END,
    (floor(random() * 100) + 1)::int,
    (ARRAY['pending','processing','executed','failed'])[floor(random() * 4) + 1],
    gen_random_uuid()
FROM generate_series(1, 100);