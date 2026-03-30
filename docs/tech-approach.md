# MyTherapy Technical Approach

## 1. Goal

Choose the lowest-cost technical path that supports:

- fast MVP delivery
- iOS-first product quality
- future cloud sync expansion
- future Mini Program launch with advertising

## 2. Recommended Strategy

Use a staged architecture.

### Stage 1: Local-First MVP

- build for iOS first
- store product data locally
- keep AI OCR behind a replaceable service layer
- design data structures so they can later sync to cloud

Why this is recommended:

- lowest initial cost
- fastest validation path
- avoids overbuilding login, sync, and backend too early

### Stage 2: Cloud Sync Expansion

- add user account support
- add cloud persistence and image storage
- support multi-device continuity
- support Mini Program data sharing where needed

## 3. Frontend Direction

Recommended MVP direction:

- `uni-app + Vue 3 + TypeScript`

Why:

- supports iOS and WeChat Mini Program targets
- gives the project a chance to reuse part of the codebase
- keeps early cost lower than fully separate apps

Important product note:

- if iOS reminder reliability, native permissions, or user experience become limiting, the iOS app should be strengthened even if Mini Program reuse must be reduced

That means the product should optimize for patient trust first, not for maximum code reuse.

## 4. Backend Direction

Stage 1:

- no required full cloud backend
- keep OCR access and export generation behind service interfaces

Stage 2 candidate:

- `Supabase Free` as the first cloud option to validate sync and storage

Why Supabase is the current recommended candidate:

- low setup complexity for small teams
- includes database, auth, and storage
- free tier is suitable for early validation

This candidate is not locked yet and should be confirmed before stage 2 implementation.

## 5. Database Decision Status

The database decision is intentionally not finalized in this document.

Current agreed product direction:

- stage 1: local-first
- stage 2: evaluate `Supabase Free`

Before implementation, the following still needs confirmation:

- exact local persistence layer
- whether user accounts are needed at the start of stage 2
- how image files should be stored in stage 2

## 6. AI OCR Strategy

The product should use AI for structured extraction, not autonomous medical decision-making.

Recommended OCR flow:

1. user uploads or captures an image
2. OCR service extracts medication fields
3. system produces structured draft data
4. user reviews and edits data
5. confirmed plan becomes active

High-risk fields to validate carefully:

- medication name
- dosage
- frequency
- duration
- special notes

## 7. Suggested Domain Model

Even in stage 1, the local data model should resemble future sync objects.

Suggested entities:

- user profile
- medication
- medication plan
- scheduled dose
- medication log
- inventory record
- health metric record
- side-effect record
- import record
- export record

This allows a smoother move from local-only storage to cloud sync later.

## 8. Export Strategy

Stage 1 export should be simple and practical.

Recommended first approach:

- generate a readable summary file
- focus on medication history, side effects, and basic metrics

The exact export format should be decided later based on implementation cost.

## 9. Notification Strategy

For the MVP:

- prioritize reliable medication reminders on iOS
- make reminder generation part of the core architecture

For later Mini Program work:

- do not assume reminder behavior will match iOS
- treat reminder capability as a platform-specific area that may require feature trimming

## 10. Advertising Strategy

Ads are for the Mini Program only.

Recommended rule:

- place ads only after the user completes a medication record

Additional safety rules:

- do not place ads before medication logging
- do not place ads in OCR review
- do not place ads in side-effect logging
- keep frequency low to protect trust

## 11. Implementation Principles

- keep business logic separate from storage logic
- keep OCR integration separate from UI flow
- keep export generation separate from presentation layer
- prefer simple modules over broad frameworks
- avoid locking the MVP into a cloud dependency too early

## 12. What Must Be Confirmed Later

- exact local persistence implementation
- exact export format priority
- stage 2 cloud provider decision
- Mini Program launch timing
