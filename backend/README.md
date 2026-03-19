# Nanaska Backend

NestJS REST API for the Nanaska CIMA platform.  
Stack: **NestJS · Prisma · PostgreSQL · JWT · PayHere IPG**

---

## Quick Start

```bash
cd backend
cp .env.example .env          # fill in your values
npm install
npx prisma migrate dev        # run migrations
npm run prisma:seed           # seed courses & combinations
npm run dev                   # start dev server (port 3001)
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default `3001`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `https://nanaska.com`) |
| `IPG_MERCHANT_ID` | PayHere merchant ID |
| `IPG_MERCHANT_SECRET` | PayHere merchant secret |
| `IPG_BASE_URL` | PayHere checkout URL |
| `IPG_NOTIFY_URL` | Public webhook URL (`/payments/webhook`) |
| `IPG_RETURN_URL` | Frontend success redirect |
| `IPG_CANCEL_URL` | Frontend cancel redirect |
| `IPG_CURRENCY` | Currency code (default `LKR`) |

---

## API Reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | – | Register new user |
| POST | `/auth/login` | – | Login, returns JWT |
| GET | `/auth/profile` | JWT | Get current user profile |

### Courses
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/courses` | – | List all subjects |
| GET | `/courses/:id` | – | Get single subject |
| GET | `/courses/combinations` | – | List all combinations |
| GET | `/courses/combinations/:id` | – | Get single combination |

### Orders
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/orders` | JWT | Create order |
| GET | `/orders/my` | JWT | List my orders |
| GET | `/orders/:id` | JWT | Get specific order |

### Payments
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/create` | JWT | Create order + IPG payload |
| POST | `/payments/webhook` | IPG | Receive payment notification |

---

## Payment Flow

```
1. Frontend  →  POST /payments/create  { combinationId }
2. Backend   →  creates PENDING order, signs PayHere payload
3. Frontend  →  redirects user to IPG checkout (payload.paymentUrl + payload.payload)
4. PayHere   →  POST /payments/webhook  { md5sig, status_code, … }
5. Backend   →  verifies signature → updates order → grants UserCourse access
```

### Frontend example

```js
const API_URL = import.meta.env.VITE_API_URL;

const res = await fetch(`${API_URL}/payments/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ combinationId: 'cert_full' }),
});

const { paymentUrl, payload } = await res.json();

// Build a hidden form and submit to the IPG
const form = document.createElement('form');
form.method = 'POST';
form.action = paymentUrl;
Object.entries(payload).forEach(([k, v]) => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = k;
  input.value = String(v ?? '');
  form.appendChild(input);
});
document.body.appendChild(form);
form.submit();
```

---

## Deployment

### Render / Railway
1. Set all env vars in the platform dashboard
2. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
3. Start command: `npm run start`

### VPS (PM2)
```bash
npm run build
npx prisma migrate deploy
pm2 start dist/main.js --name nanaska-backend
```
