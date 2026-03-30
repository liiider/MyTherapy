---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Use when writing, reviewing, or refactoring React or Next.js code.
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React Best Practices

Use this skill when the repository moves from static prototype HTML into React or Next.js implementation.

## When to Apply

- Writing new React components or Next.js pages
- Refactoring existing React or Next.js UI
- Reviewing component structure or performance
- Optimizing bundle size, rendering, or client/server boundaries

## Rule Order

Review in this priority order:
1. Eliminate waterfalls
2. Bundle size optimization
3. Server-side performance
4. Client-side data fetching
5. Re-render optimization
6. Rendering performance

## Use in This Project

Do not use this skill to judge the current static HTML prototype.
Use it only after prototype decisions have been frozen and implementation moves into a React or Next.js codebase.
