# Elasheva Pay — Security Validation Record

## Implemented controls
- OTP codes generated with `crypto.randomInt`, HMAC-hashed at rest, short-lived and single-use.
- OTP attempts capped; request endpoint rate-limited.
- PIN is bcrypt-hashed and locked after repeated failures.
- JWT secret is required and must be at least 32 characters.
- Paystack webhook signatures use HMAC-SHA512 and constant-time comparison.
- Webhook event uniqueness is enforced by `(provider,eventId)` and payment fulfillment is idempotent by payment reference/status.
- Provider verification is performed server-side; client redirects are not trusted as proof of payment.
- Payment amount is checked against the provider amount before fulfillment.
- Ledger posting occurs in a database transaction.
- Secrets are excluded from the mobile client and `.env` is not intended for source control.
- API exposes `/health`, `/ready` and Prometheus `/metrics`.
- Authentication, PIN and payment endpoints have rate limits.
- Admin endpoints require an `ADMIN` JWT role.

## Automated checks
The intended CI command is:

`npm run check`

It runs the static security check, Vitest tests and the TypeScript/Prisma build.

### Environment execution result
- Static security check: **PASS**.
- Full npm dependency installation: **BLOCKED BY ENVIRONMENT TIMEOUT** (the package registry install did not complete within the available execution window).
- Therefore the Vitest and TypeScript build could not be truthfully reported as executed in this environment.
- A standalone TypeScript invocation also confirmed that the required Node type/dependency tree is unavailable until dependencies are installed.

## Required independent validation before real-money launch
- SAST/dependency scanning in CI.
- Container image scanning.
- DAST against staging.
- Independent penetration test.
- Mobile security testing against OWASP MASVS.
- Provider sandbox end-to-end tests and reconciliation tests.
- Production secret-management review.
- Legal/compliance review and confirmation of the applicable Nigerian payment licensing/partner model.
