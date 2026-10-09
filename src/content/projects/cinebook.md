---
order: 2
name: cinebook
status: in progress
summary: Cinema booking where a seat can only sell once.
stack: [go, postgres]
tags: [go, postgres, testcontainers]
links:
  - label: read the design notes
    href: https://github.com/FreddieTheObserver/cinebook#readme
  - label: try the live demo
    href: https://cinebook-saqb.onrender.com
media: { kind: plate, id: cinebook }
---

A cinema booking service where two people can never get the same seat.
Postgres is the arbiter: an advisory lock per showtime, a hold with a TTL, then confirm.
