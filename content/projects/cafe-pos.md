---
order: 1
name: cafe-pos
status: Completed
summary: A cafe POS backend where the self-order kiosk is a first-class client.
stack: [TypeScript, NestJS, PostgreSQL, Drizzle, Redis]
links:
  - label: Source on GitHub
    href: https://github.com/FreddieTheObserver/cafe-pos
---

Customers order and pay at unattended kiosks, staff use a counter POS, and baristas work from a real-time Kitchen Display System.
Because a kiosk can't be trusted, the backend computes prices server-side, follows payment state from the gateway webhook, and makes every money-mutating request idempotent.
A written design spec covers the domain model, API, authorization matrix and database design, and integration tests run against real Postgres and Redis.
