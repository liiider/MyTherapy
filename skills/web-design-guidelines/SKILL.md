---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to review UI, check accessibility, audit design, review UX, or check a site against best practices.
metadata:
  author: vercel
  version: "1.0.0"
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below.
2. Read the specified files.
3. Check against all rules in the fetched guidelines.
4. Output findings in terse `file:line` form or a concrete issue list when used inside a review workflow.

## Guidelines Source

Fetch fresh guidelines before each review:

`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`

## Use in This Project

For this repository, use this skill after `ui-ux-pro-max` has defined the intended visual target.
Focus review on:
- primary action clarity
- navigation weight
- card stacking and surface conflicts
- text overflow and wrapping risk
- spacing, touch targets, and interaction density
- icon duplication and semantic consistency

When a screenshot is available, compare the screenshot against the changed file instead of reviewing the code in isolation.
