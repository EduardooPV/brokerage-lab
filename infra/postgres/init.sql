CREATE TABLE accounts (
    id     SERIAL PRIMARY KEY,
    balance  NUMERIC(15, 2) NOT NULL DEFAULT 0
);

CREATE TABLE assets (
    id     SERIAL PRIMARY KEY,
    name   VARCHAR(10) NOT NULL,
    price  NUMERIC(15, 2) NOT NULL
);

CREATE TABLE orders (
    id         SERIAL PRIMARY KEY,
    account_id   INTEGER NOT NULL REFERENCES accounts(id),
    asset_id   INTEGER NOT NULL REFERENCES assets(id),
    type       VARCHAR(6) NOT NULL CHECK (type IN ('buy', 'sell')),
    quantity INTEGER NOT NULL,
    status     VARCHAR(12) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'processing', 'executed', 'failed')),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    transaction_id UUID UNIQUE NOT NULL
);