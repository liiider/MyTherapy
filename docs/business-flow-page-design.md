# MyTherapy Business Flow and Page Design

## 1. Key Decisions in This Update

This update confirms the following directions:

- keep 4 bottom tabs
- Therapy manages treatment objects, but no multi-profile care for now
- add an AI chat capability similar to Support, but do not give it a standalone tab
- side effects, mood, self-check tasks, and custom reminders should be modeled as schedulable treatment objects, not just passive history data

This means the product is not only a medication reminder app. It is a lightweight treatment execution system.

## 2. Updated 4-Tab Definition

### 2.1 Today

Role:

- daily execution center
- all treatment-related tasks for the current day should appear here

Task types:

- medication
- metrics
- mood check
- symptom / side effect check
- appointment reminder
- custom memo

### 2.2 Records

Role:

- review completion and history
- inspect medication, metrics, mood, and side effect records

Content:

- adherence overview
- history list
- side effect summary
- mood summary
- metric trends
- export

### 2.3 Therapy

Role:

- manage treatment objects and task templates
- define what will later appear in Today

Object types:

- medications
- metrics
- mood checks
- symptom / side effect checks
- appointments
- custom reminders

### 2.4 Settings

Role:

- account, permissions, reminders, help, and AI assistant

Content:

- profile
- reminder settings
- permission checks
- data and backup
- help and feedback
- AI assistant
- about

## 3. Where Side Effect Data Should Enter the Product

This is a key design question.

If side effect summaries only exist in Records, but there is no strong data entry flow, users will not generate stable data.

Recommended 3-layer entry model:

### 3.1 Primary Entry: Today task for side effect / symptom check

This should be the main entry.

Flow:

- user creates a symptom / side effect check object in Therapy
- user sets a schedule, for example every day at 20:00
- the system generates a task in Today
- user opens the task and logs nausea, dizziness, stomach pain, or other symptoms

### 3.2 Secondary Entry: floating add button in Today

Use case:

- spontaneous symptoms
- missed planned check time

### 3.3 Tertiary Entry: backfill entry in Records

Use case:

- users add or correct missing data later

Conclusion:

- side effect summaries should not rely on Records as the main data entry point
- the main source of data should be Today tasks
- Records is primarily for review and backfill

## 4. How Mood Tracking Should Work

The reference product treats mood as an independent schedulable object. That is worth borrowing.

Recommended design:

- allow a Mood Check object in Therapy
- user sets a schedule, for example every day at 21:00
- the system creates a Today task
- the mood task records:
  - mood score
  - optional mood tags such as anxious, calm, low, irritated
  - notes

Why it matters:

- mood may relate to medications or disease state
- it is low-friction but high-value longitudinal data
- it becomes especially useful alongside side effect data

## 5. How Custom Memo Should Work

Custom memo should also be treated as a schedulable object, not a loose notes feature.

Recommended design:

- create a Custom Reminder object in Therapy
- user defines title, frequency, time, and notes
- the system generates a task in Today
- user marks it complete and may add a note

## 6. Updated End-to-End Business Flow

### 6.1 Initial Plan Creation

1. user enters the app
2. imports prescription / instructions through OCR
3. the system generates medication objects
4. user opens Therapy and optionally adds:
   - metric tracking
   - mood checks
   - side effect checks
   - custom reminders
5. the system generates daily tasks based on these objects

### 6.2 Daily Execution Flow

1. user opens Today
2. sees all tasks for the day
3. completes medication, metrics, mood, and side effect tasks
4. completed tasks move into the collapsed completed section
5. the system highlights exceptions such as missed doses, low inventory, or repeated symptoms

### 6.3 Review Flow

1. user opens Records
2. reviews history
3. inspects side effect, mood, and metric summaries
4. backfills missing entries if necessary
5. exports follow-up data

### 6.4 Configuration Flow

1. user opens Therapy
2. adds or edits medications, metrics, mood checks, symptom checks, and custom reminders
3. these objects determine what appears in Today

### 6.5 Support Flow

1. user opens Settings
2. uses help center, feedback, or AI assistant
3. resolves reminder, permission, or product understanding issues

## 7. Updated Page Design Recommendations

### 7.1 Today

Today should display mixed task types, not medication only.

Suggested task labels:

- Medication
- Metric
- Mood
- Symptom
- Appointment
- Memo

### 7.2 Records

Records should have three layers:

- Overview
- History
- Export

Overview should include:

- adherence rate
- streak count
- recent side effect summary
- recent mood summary
- recent metrics summary

### 7.3 Therapy

Suggested sections:

- Medications
- Metrics
- Mood Checks
- Symptom / Side Effect Checks
- Appointments
- Custom Reminders

Suggested add menu order:

1. scan prescription / instructions
2. add medication
3. add metric
4. add mood check
5. add symptom / side effect check
6. add custom reminder

### 7.4 Settings

Help section should include:

- FAQ
- feedback
- AI assistant

The AI assistant in MVP should help with:

- explaining product entry points
- explaining how to create tasks
- explaining why reminders may not work

It should not provide:

- medical advice
- medication recommendations
- symptom diagnosis

## 8. Key Product Principles

- whenever possible, data collection should become a Today task
- Therapy creates task templates
- Records is for review and export, not the primary data entry surface
- AI chat is a support capability, not a main execution flow
- multi-profile care should stay out of MVP

## 9. Direct Impact on Prototype Design

The next prototype phase should prioritize:

1. Today with mixed task list
2. OCR confirmation page
3. Therapy with grouped object management
4. add menu page
5. mood check entry page
6. symptom / side effect entry page
7. Records overview

## 10. Conclusion

With these updates, the product structure becomes much more complete.

The system now works as:

- OCR generates medication plans
- Therapy defines future task templates
- Today executes all daily tasks
- Records reviews, summarizes, and exports data
- Settings handles support, permissions, and AI assistant
