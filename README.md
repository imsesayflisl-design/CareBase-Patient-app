# CareBase — Patient App

**Better Health. Closer to You.**

CareBase is a mobile healthcare companion that connects patients with hospitals, doctors, pharmacies, diagnostic scans, and emergency services in one place. This repository contains the **patient mobile app** (Expo / React Native). The **hospital web dashboard** is a separate app, but both products are powered by the **same CareBase API and the same database** — so data published by a hospital is immediately visible to patients, and every request a patient sends lands in that hospital's dashboard.

---

## What patients can do

- **Find hospitals** — browse, search, view departments, services, notices, and contact details.
- **Book appointments** — pick a hospital, doctor, date, and time slot, then submit a booking request.
- **Request beds** — check availability and send an admission/booking request to a hospital.
- **Book scans** — browse scan services and request in-hospital or home-service scans.
- **Emergency** — find nearby emergency hospitals and send an emergency request.
- **Pharmacies & medicines** — locate pharmacies and check medicine availability.
- **Medical records** — visits, prescriptions, tests, scans, and documents.
- **Health tracking** — record blood pressure, heart rate, weight, temperature, and blood glucose.
- **Payments** — review, pay, and keep a receipt history.
- **Notifications** — status updates for appointments, beds, scans, payments, and hospital notices.

The app is built to be honest when the backend is not connected: screens show a "waiting for CareBase backend" state instead of inventing medical data.

---

## How the two apps share data

The golden rule: **the database is never accessed directly by either client.** Both apps talk to the CareBase API, and the API is the only thing that owns the database connection.

```text
                         ┌──────────────────────────┐
                         │      Shared database     │
                         │  hospitals, doctors,     │
                         │  slots, appointments,    │
                         │  bed/scan requests, ...  │
                         └────────────▲─────────────┘
                                      │
                         ┌────────────┴─────────────┐
                         │      CareBase API        │
                         │  auth + business rules   │
                         └──────▲────────────▲──────┘
                                │            │
              patient requests  │            │  hospital manages
                                │            │
                     ┌──────────┴──┐    ┌────┴──────────────┐
                     │ Patient app │    │ Hospital web app  │
                     │  (this repo)│    │  (separate repo)  │
                     └─────────────┘    └───────────────────┘
```

### The end-to-end flow

1. **A hospital is added** — an administrator or hospital account creates the hospital on the web dashboard. The API writes it to the shared `hospitals` table with its services, departments, doctors, slots, and availability.
2. **The patient app sees it immediately** — `GET /v1/hospitals` reads the same table, so the new hospital appears in the patient's Hospitals tab and search results (no sync job or copy needed).
3. **A patient sends a request** — booking an appointment, a bed, a scan, or an emergency request calls `POST /v1/...`. The request is stored in the shared database with a `pending` status and the target `hospitalId`.
4. **The hospital sees it in its dashboard** — the web dashboard queries the same table filtered by that hospital's ID, so the request appears in its queue in real time.
5. **The hospital responds** — staff approve, reject, confirm, reschedule, or complete the request. The API updates the shared row.
6. **The patient sees the update** — the app refetches the request and receives a notification. There is one copy of the truth for both sides.

### Rules that keep the shared data safe

- **One backend, one database.** The hospital web app and the patient app never connect to Postgres/Supabase directly. Only the API does.
- **Server-side authorization.** The API verifies the Clerk JWT and checks role (`patient` vs `hospital`) before returning or changing data.
- **Hospital scoping.** Every hospital-side query is scoped by the authenticated hospital's `hospitalId`, so one hospital can never read another hospital's requests.
- **Patient ownership.** A patient can only read or cancel their own appointments and requests.
- **Shared status enums.** Both apps use the same statuses (`pending`, `confirmed`, `rejected`, `cancelled`, `completed`, etc.) so a change made on one side is always understood by the other.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Mobile app | Expo SDK 57, React Native 0.86, React 19 |
| Routing | Expo Router (file-based, typed routes) |
| Language | TypeScript |
| Auth | Clerk (`@clerk/expo`) |
| Data | CareBase REST API (`/v1/*`) |
| Storage | `expo-secure-store` / AsyncStorage for local preferences |
| Maps | Native map app via deep links |
| Builds | EAS Build / EAS Update |

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy the values in `.env.local` and fill in the real keys. Only `EXPO_PUBLIC_*` variables are read by the mobile app.

| Variable | Where to get it | Required |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | The deployed CareBase API URL, or `http://localhost:4000` locally | Yes, for live data |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys (`pk_test_...`) | Yes, for real auth |
| `EXPO_PUBLIC_MAPS_PROVIDER` | `none`, `google`, or `apple` | No |

> **Database credentials do not belong in this file.** `DATABASE_URL`, `CLERK_SECRET_KEY`, and any service-role keys stay in the backend/hospital web app's server environment. Anything prefixed with `EXPO_PUBLIC_` is embedded in the shipped app and is publicly readable.

### 3. Start the app

```bash
npx expo start
```

Then open it in a development build, an iOS simulator, an Android emulator, or Expo Go.

> On a physical device, `localhost` points to the phone itself. Use your computer's LAN IP for `EXPO_PUBLIC_API_URL` (for example `http://192.168.1.20:4000`).

### 4. Run checks

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
npx expo-doctor    # dependency / config health
```

---

## API surface used by the patient app

All routes are under `EXPO_PUBLIC_API_URL` and require a Clerk bearer token.

| Area | Endpoints |
| --- | --- |
| Profile | `GET/PUT/PATCH /v1/patients/me` |
| Hospitals | `GET /v1/hospitals`, `GET /v1/hospitals/:id` |
| Doctors | `GET /v1/doctors`, `GET /v1/doctors/:id`, `GET /v1/doctors/:id/slots` |
| Appointments | `GET/POST /v1/appointments`, `GET /v1/appointments/:id`, `POST /v1/appointments/:id/cancel`, `POST /v1/appointments/:id/reschedule` |
| Beds | `GET /v1/beds`, `GET/POST /v1/bed-requests` |
| Scans | `GET /v1/scans`, `GET/POST /v1/scan-bookings` |
| Pharmacies | `GET /v1/pharmacies`, `GET /v1/pharmacies/:id`, `GET /v1/medicines/search` |
| Records | `GET /v1/records`, `GET /v1/prescriptions` |
| Health | `GET/POST /v1/health-readings` |
| Notifications | `GET /v1/notifications`, `POST /v1/notifications/:id/read` |
| Payments | `GET /v1/payments` |
| Notices | `GET /v1/notices` |
| Search | `GET /v1/search?q=` |

The API client lives in `src/lib/api/client.ts`; the typed patient endpoints live in `src/lib/api/patient.ts`.

---

## Project structure

```text
src/
├── app/              Expo Router screens (file = route)
│   ├── (auth)/       Sign in, sign up, verification, password reset
│   ├── (onboarding)/ Intro, welcome, location, notifications
│   ├── (tabs)/       Home, hospitals, appointments, records, more
│   ├── appointments/ Booking flow and appointment details
│   ├── beds/         Bed availability and requests
│   ├── scans/        Scan services, booking, reports
│   ├── emergency/    Emergency hospitals and requests
│   ├── hospitals/    Hospital details, departments, notices, map
│   ├── doctors/      Doctor list, profile, availability
│   ├── pharmacies/   Pharmacy list, details, directions
│   ├── records/      Visits, prescriptions, tests, documents
│   ├── health/       Health readings and history
│   ├── payments/     Payment review, processing, receipts
│   └── system/       Access denied, offline, session expired, etc.
├── components/       Cards, forms, UI primitives, states
├── constants/        Colors and theme tokens
├── hooks/            Async data, mutations, theme
├── lib/              API client, auth bridge, config, storage, maps
├── types/            Shared TypeScript models
└── utils/            Date and appointment helpers
```

---

## Configuration behavior

The app degrades gracefully instead of crashing when keys are missing:

- **No Clerk key** → local demo auth keeps navigation and forms usable.
- **No API URL** → screens show a "waiting for CareBase backend" message.
- **No live data** → empty states explain what will appear once the backend is connected.

This makes the app safe to run in Expo Go before the backend and hospital dashboard are wired up.

---

## Building with EAS

EAS builds, signs, and submits the app in the cloud and ships over-the-air updates:

```bash
npx eas-cli@latest build
npx eas-cli@latest update
```

See the [EAS docs](https://docs.expo.dev/eas/) for profiles and store submission.

---

## Related repositories

- **CareBase patient app** — this repository.
- **CareBase hospital web app** — the hospital dashboard (onboarding, doctors, slots, appointment/bed/scan queues).
- **CareBase API** — the single backend both clients share; owns the database and authorization.

If you are setting up the hospital web app or API, reuse the **same database URL** used by the backend there — not a copy, and not a client-side connection.
