---
order: 4
name: airline-management-system
status: In progress
summary: An airline system built by 16 student teams, where I lead the shared database.
stack: [PostgreSQL, Prisma, NestJS, TypeScript, React]
links:
  - label: Source on GitHub
    href: https://github.com/CSC290-2026-AIRLINE/airline-management-system
---

A course project where 16 student teams each build one part of an airline, from flight scheduling and crew rostering to booking, check-in, payments and cargo.
As Database Lead, I design each team's schema and merge it into one PostgreSQL schema of 168 tables, with one migration per feature, added in dependency order.
Rules Prisma can't express, like exclusion constraints, partial unique indexes and triggers, stay in raw SQL, and I test every migration I add on PostgreSQL 16, including a drift check against the Prisma schema.
