---
name: design-agent-orchestrator
description: Use for UI, UX, layout, visual polish, design review, or prototype refinement when multiple skills or agents should be coordinated. This skill enforces a strict flow: define visual direction first, review against web guidelines second, code third, and re-review after edits. Use when the user wants higher design quality, stricter UI review, or separate review and coding roles.
---

# Design Agent Orchestrator

Coordinate UI work instead of letting one agent improvise end to end.

## When to Use

Use this skill when the task changes:
- layout, spacing, hierarchy, typography, color, buttons, cards, navigation, icons
- static prototypes, HTML pages, landing pages, dashboards, mobile app screens
- design review, UI polish, UX cleanup, or high-fidelity refinement
- any task where the user wants a reviewer and a separate coding agent

Do not use this skill for backend-only work.

## Required Skill Order

Always use skills in this order:
1. `ui-ux-pro-max`
2. `web-design-guidelines`
3. `frontend-patterns` or `react-best-practices` when implementing
4. `verification-loop` before completion on substantial changes

If the task is static HTML/CSS, prefer `frontend-patterns` only as a light implementation companion.
If the task is React or Next.js, also apply `react-best-practices` after visual decisions are fixed.

## Required Agent Roles

When subagents are available and the user allows delegation, split the work:
- Reviewer agent: uses `ui-ux-pro-max` and `web-design-guidelines` only. Produces a concrete issue list and acceptance criteria. Does not edit files.
- Coding agent: uses `gpt-5.3-codex` when model selection is available. Applies the reviewer task list. Does not self-approve.
- Main agent: decides scope, sends the task list, checks whether the reviewer says the screen passes, and only then reports completion.

Never let the coding agent define the design target and approve its own result in the same pass.

## Workflow

### 1. Define the target before coding

Use `ui-ux-pro-max` to answer these questions before edits:
- What is the single primary focus of this screen?
- Which elements must be visually weaker?
- What are the main anti-patterns to remove?
- What is the intended tone: clinical, warm, bold, minimal, etc.?

Write the target as 3-6 concrete rules.

### 2. Review the current screen

Use `web-design-guidelines` to inspect the current files and any provided screenshot.
Focus on:
- hierarchy and primary action clarity
- navigation weight and predictability
- card density and stacked-surface conflicts
- touch spacing and button prominence
- icon consistency and duplication
- text length, wrapping, and overflow risk

Output must be concrete and actionable.
Prefer a short issue list over a generic design summary.

### 3. Send a minimal coding brief

The coding agent should receive:
- exact files it may edit
- 1-5 problems to fix
- what not to touch
- the rule that the main screen must have one clear visual focus

Prefer reduction over decoration.
If a screen still feels crowded, remove layers before adding style.

### 4. Re-review after edits

Run the reviewer again on the changed screen.
If the reviewer still says "not passed", send only the smallest remaining fix list to the coding agent.
Repeat until the reviewer says the screen passes or only minor polish remains.

## UI Rules for Prototype Screens

For mobile prototypes like this project:
- A screen should have one dominant card or content block, not several equal-weight blocks competing.
- Date strips, filters, and secondary controls must be visually lighter than the main task card.
- Bottom navigation should feel stable and low-weight; it must not visually compress the screen.
- Avoid nested card-on-card structures unless the inner surface is clearly subordinate.
- Do not repeat the same meaning in icon, chip, and heading at once.
- Secondary actions should usually be text or ghost buttons, not equal-weight twins beside the primary CTA.
- If text is too long, shorten the content structure before relying on truncation.

## Completion Standard

A UI task is not done when it is "better than before".
It is done when:
- primary focus is obvious
- navigation no longer competes with content
- buttons have clear hierarchy
- cards no longer visually collide or obscure one another
- reviewer and coding roles have both completed their passes

## Output Guidance for Main Agent

When reporting back to the user:
- say which skills were used and in what order
- say whether review and coding were separated
- state whether the reviewer considers the screen passed
- if not passed, continue the loop instead of presenting the work as finished
