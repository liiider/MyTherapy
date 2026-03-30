# MyTherapy PRD

## 1. Product Summary

MyTherapy is an AI-assisted medication management product for patients.

The product helps users turn doctor instructions, prescriptions, and medication lists into a clear daily medication schedule through AI OCR, then supports reminders, medication logs, inventory tracking, side-effect tracking, and data export.

The MVP is focused on iOS first. A WeChat Mini Program may be added later with a trimmed feature set and advertising.

## 2. Product Goal

Build a simple patient-side tool that reduces the effort required to:

- understand what medicine to take
- follow a medication schedule
- keep a usable medication history
- avoid running out of medicine
- prepare records for follow-up visits

## 3. Business Goal

Stage 1 goal:

- validate that users are willing to upload doctor instructions or prescriptions
- validate that users trust AI-generated medication plans after confirmation
- validate that users will keep using reminders and medication logs

Stage 2 goal:

- add account and sync support
- launch a trimmed WeChat Mini Program
- monetize the Mini Program with low-interruption ads

## 4. Target Users

Primary users:

- patients with long-term medication needs
- patients with chronic disease management needs
- users who struggle to manually organize medication schedules

Secondary users:

- family members helping patients manage medicine

## 5. Core User Problem

Patients often receive medication instructions in paper form, screenshots, or handwritten notes.

They then need to manually:

- read the instructions
- understand dosage and frequency
- set reminders
- track whether they actually took the medicine
- remember when medicine is running low
- describe side effects during the next visit

This is tedious and error-prone.

## 6. Value Proposition

MyTherapy turns medication instructions into an executable daily routine.

Instead of asking the user to build everything manually, the product helps them:

- scan the instructions
- confirm the extracted details
- receive reminders
- record medication intake with one tap
- track inventory and side effects
- export useful records for follow-up visits

## 7. MVP Scope

### In Scope

#### 7.1 AI OCR Import

- take a photo or upload a medication instruction, prescription, or medication sheet
- extract medication name, dosage, frequency, duration, and notes
- generate a structured draft plan
- require user confirmation before any plan becomes active

#### 7.2 Medication Reminders

- create reminder schedules from confirmed medication plans
- support multiple reminders per day
- support simple timing notes such as before meal or after meal
- show a clear "today" task list

#### 7.3 Medication Log

- mark a scheduled dose as taken
- support skip and delay actions
- record actual time of action

#### 7.4 Medication Inventory

- estimate remaining medication based on plan and logs
- alert user when inventory is low

#### 7.5 Metrics and Side-Effect Tracking

- allow user to record simple health metrics such as blood pressure, blood sugar, or weight
- allow user to record side effects such as nausea, dizziness, sleepiness, stomach pain

#### 7.6 Data Export

- export medication history
- export side-effect and metric logs
- make the export usable for follow-up visits

## 8. Out of Scope for MVP

- doctor-side product
- diagnosis or treatment advice
- complex family collaboration workflows
- full multi-device sync in stage 1
- deep pharmacy or insurance integrations
- advanced calendar integration in stage 1

## 9. Key User Flow

1. User opens the app for the first time.
2. User imports a prescription or medication instruction.
3. AI extracts the medication details into a draft.
4. User reviews and edits the draft.
5. User confirms the medication schedule.
6. App creates reminder tasks.
7. User records medication intake over time.
8. Inventory updates based on plan and logs.
9. User records side effects or health metrics.
10. User exports data before a follow-up visit.

## 10. Key Screens

- onboarding / empty state
- import screen
- OCR processing state
- OCR confirmation screen
- home / today medication schedule
- medication detail screen
- reminder edit screen
- medication log screen
- inventory screen
- side-effect and metric record screen
- export screen

## 11. Functional Requirements

### 11.1 OCR Import

- the system must accept image input
- the system must extract structured medication fields
- the system must highlight missing or uncertain fields
- the system must not activate a medication plan without user confirmation

### 11.2 Reminder System

- the system must generate daily reminder tasks from confirmed plans
- the home screen must show pending tasks for today
- the user must be able to mark a task as taken, skipped, or delayed

### 11.3 Logging

- the system must persist user medication actions locally in stage 1
- the log must retain scheduled time and actual action time

### 11.4 Inventory

- the system must track estimated remaining quantity
- the system must warn when remaining quantity falls below a threshold

### 11.5 Side-Effect and Metric Recording

- the system must support quick entry flows
- the system must support timestamped records

### 11.6 Export

- the system must export records into a user-shareable format
- the export must be understandable outside the app

## 12. Product Rules

- AI is used for extraction and suggestion only
- users must confirm medication details before activation
- the product must not present itself as replacing a doctor
- the fastest path in the app should always be the "today" medication action flow
- critical health actions must not be interrupted by ads

## 13. Advertising Strategy

Advertising applies to the future WeChat Mini Program, not the iOS app.

Principles:

- no ads on iOS in MVP
- ads only in the Mini Program
- ads should appear only after a medication record is completed
- do not interrupt OCR confirmation, medication reminder action, or side-effect entry
- control frequency carefully

Recommended initial rule:

- show lightweight ad placement after a medication record is completed
- avoid forcing an ad on every record
- prefer a low-frequency placement with trust preserved

## 14. Platform Strategy

### Stage 1

- build iOS-first MVP
- keep architecture expandable
- prioritize fast validation and low cost

### Stage 2

- evaluate WeChat Mini Program launch
- trim feature scope if full reuse is not practical
- add account and cloud sync support

## 15. Success Metrics

Early validation metrics:

- import-to-confirmation conversion rate
- percentage of confirmed plans that generate active reminders
- medication log completion rate
- 7-day retention
- 30-day retention
- export usage before follow-up visits

Mini Program metrics for later stage:

- activation rate
- log completion rate
- ad impression quality
- revenue per active user

## 16. Risks

- OCR extraction errors may reduce trust
- users may abandon the app if initial setup takes too long
- reminder reliability is more important than feature breadth
- Mini Program feature limits may require scope trimming
- moving from local-only storage to sync must be planned carefully

## 17. Open Decisions

These items are intentionally left open for future confirmation:

- exact local database choice for stage 1
- exact cloud sync provider for stage 2
- export file format priority
- whether calendar write-back is needed after MVP
