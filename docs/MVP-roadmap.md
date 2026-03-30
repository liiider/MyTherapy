# MyTherapy MVP Roadmap

## Objective

Launch the smallest useful patient-side product that proves the AI OCR medication workflow is valuable.

## Product Strategy

Phase 1 is local-first and iOS-first.

Phase 2 adds cloud sync and a trimmed WeChat Mini Program if the product loop proves valuable.

## Milestones

### M1. Scope and UX Definition

Deliverables:

- PRD
- key user flow
- screen list
- MVP success metrics
- technical direction for local-first architecture

Exit criteria:

- scope is fixed for MVP
- open technical choices are limited to implementation details

### M2. OCR to Confirmed Plan

Deliverables:

- import screen
- OCR processing state
- structured medication draft
- user confirmation and editing flow

Exit criteria:

- a user can convert an imported instruction into an editable plan

### M3. Reminder and Medication Logging

Deliverables:

- today screen
- reminder schedule generation
- taken / skipped / delayed actions
- medication log history

Exit criteria:

- a user can complete a full medication action loop

### M4. Inventory and Side-Effect Tracking

Deliverables:

- inventory estimation
- low inventory warning
- metric entry
- side-effect entry

Exit criteria:

- the product supports ongoing medication management beyond a one-time reminder

### M5. Export

Deliverables:

- export screen
- basic shareable output

Exit criteria:

- a user can take medication records to a follow-up visit

### M6. Sync Preparation

Deliverables:

- stable data model
- sync-ready object boundaries
- cloud migration plan

Exit criteria:

- stage 2 can start without major rework

## Recommended Build Order

1. OCR import and confirmation
2. today screen and reminder tasks
3. medication logging
4. inventory
5. side-effect and metric tracking
6. export
7. sync preparation

## Scope Guardrails

Do now:

- solve the core patient loop
- keep the workflow simple
- validate trust in OCR-assisted setup

Do later:

- doctor-side features
- advanced analytics
- complex account systems
- full Mini Program parity
- calendar write-back

## Risks and Mitigation

Risk:

- OCR results may be incomplete or ambiguous

Mitigation:

- require user confirmation
- highlight uncertain fields

Risk:

- local-only stage may create future migration pain

Mitigation:

- define stable domain models now
- separate storage logic from product logic

Risk:

- Mini Program may not fully match iOS reminder capabilities

Mitigation:

- treat Mini Program as a trimmed later-phase product

## Next Slice

The next high-value slice after documentation is:

- information architecture
- key screen wireflow
- high-fidelity clickable prototype
