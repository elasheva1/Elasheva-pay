# Elasheva Pay — Production Foundation

A production-oriented backend foundation for Elasheva Pay.

## Stack
- Node.js + TypeScript
- Fastify
- PostgreSQL
- Prisma ORM
- JWT authentication
- Zod validation
- Payment-provider abstraction (Paystack implemented)
- Webhook + server-side transaction verification
- Immutable double-entry-style wallet ledger

## Important
This repository is a foundation, not a claim that the app is ready to handle public customer funds.
Before launch:
1. Complete identity/KYC and applicable Nigerian regulatory/compliance work.
2. Use a licensed payment partner where required.
3. Configure HTTPS, secrets management, database backups, monitoring and audit logging.
4. Run security testing and payment-provider certification/testing.
5. Use TEST keys until the complete integration has been validated.

## Run locally

Requirements:
- Node.js 20+
- PostgreSQL 15+

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

API: http://localhost:3000

Health:
GET /health

Register:
POST /v1/auth/register
{
  "name": "Demo User",
  "email": "user@example.com",
  "phone": "08000000000",
  "password": "ChangeMe123!"
}

Login:
POST /v1/auth/login

Initialize wallet funding:
POST /v1/payments/initialize
Authorization: Bearer <token>
{
  "amountNaira": 10000,
  "provider": "paystack"
}

The response contains a hosted checkout URL. Do not expose provider secret keys to the mobile client.

## Production payment rule

A frontend redirect/callback is not trusted proof of payment. The backend verifies the provider transaction and checks:
- expected reference
- expected amount
- NGN currency
- successful status
- transaction has not already fulfilled

Only then does the ledger credit the user's wallet.

## Architecture

Flutter/mobile client
        |
        v
Fastify API
 |       |
 |       +--> Payment provider
 |
 +--> PostgreSQL
       |
       +--> users
       +--> wallets
       +--> ledger_accounts
       +--> ledger_entries
       +--> payment_intents
       +--> webhook_events
       +--> transactions

For wallet accounting, never update `wallet.balance` as the source of truth. The ledger entries are authoritative; a balance cache can be maintained transactionally.
