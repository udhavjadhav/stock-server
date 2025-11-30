# Stock Management Backend (NestJS + MySQL)

This is a NestJS backend for a stock management app that supports:
- Shop registration & authentication
- Product management
- Sales & invoice creation
- Dashboard stats (today's sales, last month/year, low stock, expiry alerts)

## How to run

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and update MySQL credentials:

```bash
cp .env.example .env
```

3. Start the server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`.

## Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/shops/me`
- `PUT /api/shops/me`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/sales`
- `GET /api/sales`
- `GET /api/dashboard/summary`
