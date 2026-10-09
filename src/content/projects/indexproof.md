---
order: 3
name: indexproof
status: in progress
summary: An index advisor that doesn’t trust its own LLM.
stack: [python, postgres, llm]
tags: [python, postgres, llm]
media: { kind: diagram, id: indexproof }
---

An index advisor that doesn’t trust its own LLM.
Each proposed index is built and measured in an isolated Postgres, and the rejections are the headline.
