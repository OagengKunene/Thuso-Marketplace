# Thuso Marketplace

A responsive service-marketplace MVP built around two journeys: **REQUEST** a service and **ENGAGE** a provider.

## MVP features
- Browse and search local service providers by category.
- Switch between Request and Engage discovery modes.
- Submit a service request and see it in the request board.
- View provider cards and request a direct booking.
- Demo booking list and customer/provider mode switch.
- Responsive React + Vite front end.
- PostgreSQL starter schema in `supabase/schema.sql`.

## Run locally
```bash
npm install
npm run dev
```
Then open the local URL printed by Vite.

## Current scope
This is an early front-end prototype. Requests and bookings are stored in browser local storage for demo purposes. Authentication, real-time chat, payment/escrow, notifications, dispute resolution, production API, and secure database policies still need implementation. Do not use it to process real payments or sensitive customer data.

## Stack
- React
- Vite
- Lucide React icons
- PostgreSQL starter schema

## Suggested next milestones
1. Add Supabase Auth and role-aware profiles.
2. Add database access policies and server-side validation.
3. Implement request/quote lifecycle and provider availability.
4. Integrate a compliant payment provider with webhook verification.
5. Add chat, notifications, reviews, moderation and dispute workflows.
6. Add automated tests, CI and deployment configuration.
