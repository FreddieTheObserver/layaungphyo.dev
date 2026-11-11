---
order: 6
name: floodwatch
status: Live
summary: River and rain alerts for Bangkok, on Telegram.
stack: [Go, PostgreSQL, sqlc, Telegram, GitHub Actions]
links:
  - label: Source on GitHub
    href: https://github.com/FreddieTheObserver/floodwatch
---

A Telegram bot that watches Bangkok's river and rain gauges near you, in Thai and English.
It fits tidal gauges to the harbour tide and forecasts the next six hours.
A heartbeat alarm fires if ingestion stops, so subscribers hear about a gap instead of silently getting stale data.
