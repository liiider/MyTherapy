# MyTherapy Information Architecture

## 1. Purpose

This document defines the MVP information architecture for MyTherapy, including primary navigation, secondary pages, page responsibilities, and module boundaries.

It is intended to support:

- product scope alignment
- prototype design
- page inventory confirmation
- implementation planning

## 2. IA Principles

The MVP information architecture follows these principles:

- prioritize high-frequency actions
- make the home experience centered on today's tasks
- make AI OCR import a primary entry, not a hidden tool
- group low-frequency configuration away from the main flow
- optimize for the iOS MVP first, then trim for Mini Program if needed

## 3. Primary Navigation Recommendation

The MVP should use 4 bottom tabs:

1. Today
2. Records
3. Therapy
4. Settings

Notes:

- Today is for execution
- Records is for review and trends
- Therapy is for treatment object management
- Settings is for permissions, account, help, and preferences

A standalone Support tab is not recommended for MVP.

## 4. Primary Navigation Details

### 4.1 Today

Role:

- the most frequently opened daily page
- responsible for answering “what should I do today?”

Suggested modules:

- top status area
- horizontal date strip
- next dose card
- pending tasks for today
- collapsible completed tasks
- risk alerts
- floating add button

Secondary pages:

- calendar sheet
- task detail page
- dose action confirmation page
- quick add menu

### 4.2 Records

Role:

- review execution history
- view trends and logs

Suggested modules:

- overview view
- history list view
- streak summary
- adherence summary
- side effect summary
- metric summary

Secondary pages:

- log detail page
- side effect detail page
- metric detail page
- export page

### 4.3 Therapy

Role:

- manage treatment objects in the active plan
- maintain medication, metrics, and symptom structures

Suggested modules:

- medication section
- metrics section
- side effects / symptoms section
- appointments / tasks section

Secondary pages:

- medication detail page
- medication edit page
- metric item page
- side effect item page
- add object menu

### 4.4 Settings

Role:

- manage system settings, permissions, account, and help

Suggested modules:

- profile
- reminders and notifications
- permission status
- help and feedback
- data and backup
- about

Secondary pages:

- notification settings page
- permission check page
- help center
- FAQ
- feedback entry

## 5. Position of AI OCR in the IA

AI OCR is not a deep utility. It is a core product capability.

Recommended placements:

- primary button in first-time empty state
- first item in the Today floating add menu
- first item in the Therapy add flow

OCR page chain:

1. import source selection
2. capture / upload
3. OCR processing
4. OCR confirmation
5. medication plan generation
6. success return to Today

## 6. Recommended Page Levels

### 6.1 P0 Pages

Required for MVP:

- Today page
- calendar sheet
- OCR import page
- OCR confirmation page
- task detail page
- medication action page
- Records overview
- Records history list
- export page
- Therapy page
- medication detail page
- medication edit page
- Settings page
- notification and permission page

### 6.2 P1 Pages

Can be added after MVP:

- calendar integration page
- family assistance page
- help chat page
- multi-profile care page
- travel medication planner

## 7. Home Priority Order

Recommended top-to-bottom order on the home page:

1. today / date context
2. next medication dose
3. pending tasks for today
4. completed tasks
5. inventory risk
6. side effect or metric alerts

The first screen should not prioritize:

- heavy dashboards
- long educational content
- ads
- unrelated utility tools

## 8. Records Priority Order

Records should have two tabs:

- Overview
- History

Overview should prioritize:

- weekly adherence rate
- streak count
- recent side effects
- recent metric entries

History should prioritize:

- medication logs grouped by date
- scheduled time and actual time
- skipped and delayed states

## 9. Therapy Priority Order

Recommended default sections:

- Medications
- Metrics
- Side Effects / Symptoms
- Appointments

Medication cards should include:

- medication name
- frequency
- next time
- remaining inventory

## 10. Settings Priority Order

Recommended order:

1. profile
2. reminders and notifications
3. permission status
4. data and backup
5. help and feedback
6. about

This is important because notification reliability matters more than most generic settings.

## 11. Mini Program Trimming Recommendation

If a WeChat Mini Program is launched later, it should keep:

- Today
- simplified Records
- import entry
- export

And reduce or delay:

- deep reminder dependency
- complex configuration
- advanced trend analysis

## 12. Conclusion

The best MVP information architecture is not feature-heavy. It should be built around the patient’s daily execution loop.

That means Today should be the center, supported by Records and Therapy, with Settings handling permission and help needs.
