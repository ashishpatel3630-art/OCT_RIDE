# OGI RIDE

OGI RIDE is a college transportation portal for Oriental College of Technology. It uses the Next.js App Router, PostgreSQL, and Leaflet maps. The repository includes the public route finder, student and admin portals, authorized GPS ingestion endpoints, and setup instructions.

## Prerequisites

- Node.js 20 or newer and npm.
- A PostgreSQL database reachable by the app.
- Vercel (or another Node.js host) for deployment.
- An authorized Android tracker, driver device, or compatible GPS device for live fleet locations.

## Local setup

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set the values in `.env.local` before using sign-in or dashboards. The public site will load without PostgreSQL, but transport data and private portals remain unavailable until the database is configured.

### Environment variables

| Variable | Where it is used | Description |
| --- | --- | --- |
| `DATABASE_URL` | Server only | Supabase PostgreSQL connection string; never expose it to the browser |
| `AUTH_SECRET` | Server only | Random secret of at least 32 characters used to sign sessions |
| `NEXT_PUBLIC_MAP_TILE_URL` | Browser | Optional Leaflet-compatible tile URL; defaults to OpenStreetMap |
| `NEXT_PUBLIC_MAP_ATTRIBUTION` | Browser | Optional required attribution for the selected tile provider |
| `MONGODB_URI` | Migration only | Source MongoDB connection string for the one-time migration script |
| `MONGODB_DB` | Migration only | Source MongoDB database name; defaults to `ogi_ride` |

Do not commit `.env.local`, database connection strings, session secrets, or device tokens. This demo stores salted, scrypt-hashed passwords in PostgreSQL and does not send confirmation or password reset emails. Email addresses are not verified, so use test accounts only; this demo authentication setup is not suitable for production. Admins can set a temporary student password from the Students dashboard.

## Supabase and first administrator

Create a Supabase project. In **Project Settings → Database → Connection string**, select the **Transaction pooler** and copy its URI into `.env.local` as `DATABASE_URL`. Replace the password placeholder with the database password you set for the project; percent-encode reserved characters in the password. Never use the Supabase service-role or anon key as `DATABASE_URL`. Restart the dev server after changing `.env.local`.

The app uses Supabase's managed PostgreSQL database directly through the server-only `pg` driver, so it does not need the Supabase JavaScript SDK or Supabase Auth. The app creates its tables and indexes on first use and initializes the four academic-year settings. Records are stored in PostgreSQL `jsonb` with SQL uniqueness and lookup indexes to preserve the existing domain data during this migration.

To transfer existing MongoDB data, configure both the old MongoDB URI and the new PostgreSQL URL in `.env.local`, then run this once against an otherwise empty PostgreSQL database:

```sh
npm run db:migrate
```

The migration runs in a PostgreSQL transaction and refuses to merge into a non-empty destination. Verify the imported records before removing the old MongoDB configuration. The migration tool requires MongoDB only as its source; the running application uses PostgreSQL.

The public registration form creates student accounts only. For a demo, register the account that will be the first administrator, then update that profile's `role` field to `admin` in PostgreSQL. Sign in again and use the administration portal to add routes, ordered stops, buses, students' eligibility and enrollment settings. Student eligibility must be explicitly verified before allocation requests are accepted.

Never add an administrator role field to the public sign-up form. User credentials, roles, and transport records are stored in PostgreSQL. Server-rendered route guards and API handlers verify signed, HTTP-only sessions and check roles against the PostgreSQL profile; database credentials must never be sent to the browser.

## Authentication and authorization

- `/register` creates student accounts directly in PostgreSQL without email confirmation. Password reset is performed by an administrator from the Students dashboard.
- `/dashboard` is the shared student shell. First-year accounts see onboarding; students in years 2–4 use the senior portal.
- `/admin` is restricted to profiles whose database role is `admin`.
- The Next.js proxy verifies signed HTTP-only session cookies and redirects unauthenticated dashboard requests. Server pages and API handlers also verify roles against PostgreSQL.
- PostgreSQL is accessed only by server-side code. API handlers scope student operations to the signed-in user and restrict administration endpoints to PostgreSQL profiles with the admin role.

## Map provider

Leaflet defaults to OpenStreetMap tiles and does not need an API key. Map markers only render from stored GPS reports. A map is not shown when no trip location exists. OSM's public tile service has usage policies and is not a guaranteed production tile CDN; for a production deployment, choose a tile provider suitable for your traffic and set `NEXT_PUBLIC_MAP_TILE_URL` and `NEXT_PUBLIC_MAP_ATTRIBUTION` to its documented values. Restrict any provider token to the deployed domains. The provider must permit browser access and CORS.

The app does not calculate ETAs. Route lines are only shown where administrators have stored actual stop coordinates.

## GPS device integration

In **Admin → Settings**, create a tracking device for a bus. The raw, randomly generated bearer secret is returned once; the database stores only its SHA-256 hash. Store the raw value in the device's protected configuration and rotate it by disabling the old device and provisioning a replacement if it is lost.

The device must use HTTPS and send actual GPS readings. Start a trip:

```sh
curl -X POST "$OGI_RIDE_URL/api/tracking/trips" \
  -H "Authorization: Bearer $DEVICE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"DEVICE_UUID","action":"start"}'
```

Use the returned `tripId` for each coordinate update:

```sh
curl -X POST "$OGI_RIDE_URL/api/tracking/locations" \
  -H "Authorization: Bearer $DEVICE_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"deviceId\":\"$DEVICE_ID\",\"tripId\":\"$TRIP_ID\",\"latitude\":$LATITUDE_FROM_GPS,\"longitude\":$LONGITUDE_FROM_GPS,\"accuracyM\":$ACCURACY_METERS,\"recordedAt\":\"$GPS_TIMESTAMP\"}"
```

Populate each shell variable from the authorized device, using the sensor's actual GPS coordinates and timestamp. The database rejects invalid coordinates, unauthorized device/trip pairs, duplicate device timestamps, timestamps older than 15 minutes, and timestamps more than 2 minutes in the future. End the trip with the same device token and trip ID:

```sh
curl -X POST "$OGI_RIDE_URL/api/tracking/trips" \
  -H "Authorization: Bearer $DEVICE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"DEVICE_UUID","action":"end","tripId":"TRIP_UUID"}'
```

Students see only their allocated bus; admins see the fleet. The dashboards poll PostgreSQL-backed APIs every 30 seconds for updates. A GPS report is labelled live for up to 90 seconds from its device-reported timestamp, stale after that, offline when an active trip has no position, and trip ended when the trip has ended. Browser geolocation is not used as a continuous tracker; the driver app/device must handle background GPS, permissions, battery management, and network retries.

## Tests and checks

```sh
npm run lint
npx tsc --noEmit
npm run build
```

There is no automated integration-test harness or configured PostgreSQL deployment in this repository. End-to-end authentication, authorization, allocation, and device ingestion must be verified against a configured non-production database with test accounts and an authorized GPS device. Do not treat a successful local build as proof of those external workflows.

## Vercel deployment

1. Push this repository to GitHub and import it into Vercel as a Next.js project (the application root is this directory).
2. Configure `DATABASE_URL` and the other environment variables above for Preview and Production. Keep database credentials server-only.
3. Create the first student account, then assign its `role` to `admin` in PostgreSQL.
4. Use a unique, high-entropy `AUTH_SECRET` in each deployment environment and restrict database network access to the application.
5. Configure a production map tile provider and attribution as required by its terms.
6. Deploy, test student/admin authorization and GPS ingestion using a controlled test bus, then remove test records and credentials.

## Current limitations

- This codebase has no configured PostgreSQL deployment, seed fleet, or real device. Those must be provided by the college before authentication, transport, or GPS workflows can be exercised end to end.
- No driver Android application is included. The documented HTTPS interface accepts authorized device reports; a device application must implement foreground/background GPS capture and network delivery.
- ETA calculation, browser background tracking, payments, and automatic student identity verification are intentionally not provided.
- Map tile availability depends on the external provider. Configure a production provider rather than relying on the public OSM tile endpoint for high-volume usage.
