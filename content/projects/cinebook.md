---
order: 5
name: cinebook
status: In progress
summary: Cinema booking where a seat can only sell once.
stack: [Go, PostgreSQL, Testcontainers]
links:
  - label: Design notes
    href: https://github.com/FreddieTheObserver/cinebook#readme
  - label: Live demo
    href: https://cinebook-saqb.onrender.com
---

A cinema booking service where two people can never get the same seat.
Postgres is the arbiter: an advisory lock per showtime, a hold with a TTL, then confirm.
A partial unique index is the last line of defense, and integration tests run against a real database with Testcontainers.
