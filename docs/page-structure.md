# MyTherapy Page Structure

## 1. Purpose

This document defines the MVP page structure, including page goals, main modules, primary actions, and core navigation relationships.

It is intended to support:

- page inventory alignment
- prototype design
- frontend implementation planning
- test case preparation

## 2. Page Structure Overview

The MVP page structure is organized into 5 groups:

1. first entry and empty states
2. home and execution flow
3. OCR import and confirmation flow
4. records and export flow
5. therapy and settings flow

## 3. First Entry and Empty States

### 3.1 Welcome Screen

Goal:

- explain product value
- guide the user into the OCR import flow

Main modules:

- product title
- one-line value proposition
- primary CTA: scan prescription / instructions
- secondary CTA: add medication manually

### 3.2 Today Empty State

Goal:

- explain that no active medication plan exists yet
- give the clearest next step

Main modules:

- illustration / empty state visual
- support copy
- primary CTA: import instructions
- secondary CTA: manual add

## 4. Home and Execution Flow

### 4.1 Today Home

Goal:

- let the user immediately understand what must be done today

Main modules:

- top title and status
- horizontal date strip
- calendar trigger
- next dose card
- pending task list
- collapsible completed section
- risk alerts
- floating add button

### 4.2 Calendar Sheet

Goal:

- let the user jump quickly to a specific date

Main modules:

- current month title
- previous / next month actions
- date grid
- selected day summary

### 4.3 Task Detail Page

Goal:

- show complete information for a scheduled dose

Main modules:

- medication name
- dosage and notes
- scheduled time
- before/after meal note
- inventory state
- primary action buttons

### 4.4 Quick Add Menu

Goal:

- provide one unified entry point for creation actions

Main modules:

- scan instructions / prescription
- add medication manually
- add metric record
- add side effect record

## 5. OCR Import and Confirmation Flow

### 5.1 Import Source Page

Goal:

- let the user choose capture or upload

Main modules:

- camera entry
- photo library upload entry
- import guidance

### 5.2 OCR Processing Page

Goal:

- provide clear progress feedback
- reduce waiting anxiety

Main modules:

- processing animation
- support copy
- notice that results require confirmation

### 5.3 OCR Confirmation Page

Goal:

- let the user validate AI extraction
- generate an executable medication plan

Main modules:

- original image thumbnail
- medication name field
- dosage field
- frequency field
- duration field
- special notes field
- uncertain field warnings
- confirm and generate button

### 5.4 Plan Success Page

Goal:

- confirm that the plan is ready
- move the user back into the Today flow

Main modules:

- success state
- plan summary
- go to Today CTA

## 6. Records and Export Flow

### 6.1 Records Overview

Goal:

- show adherence performance in a lightweight way

Main modules:

- weekly adherence rate
- streak count
- recent side effect summary
- recent metric summary
- switch to history view

### 6.2 Records History

Goal:

- let the user review logs by time

Main modules:

- date groups
- daily log items
- scheduled time / actual time / state

### 6.3 Export Page

Goal:

- generate a follow-up friendly record package

Main modules:

- date range selector
- export content selection
- export explanation
- export CTA

## 7. Therapy and Settings Flow

### 7.1 Therapy Page

Goal:

- manage medications and related treatment objects

Main modules:

- medication section
- metrics section
- side effects / symptoms section
- appointments section
- floating add button

### 7.2 Medication Detail Page

Goal:

- show complete information for a medication plan

Main modules:

- medication name
- frequency
- reminder times
- inventory state
- edit entry

### 7.3 Medication Edit Page

Goal:

- update medication info and reminder rules

Main modules:

- core fields form
- reminder time editor
- inventory parameter settings

### 7.4 Settings Page

Goal:

- manage system-related product settings

Main modules:

- profile
- reminders and notifications
- permission status
- data and backup
- help and feedback
- about

### 7.5 Notification and Permission Page

Goal:

- make reminder reliability visible and actionable

Main modules:

- notification status
- battery restriction status
- system permission notes
- go to system settings CTA

## 8. Key Navigation Relationships

Core path:

1. Welcome -> OCR import
2. OCR import -> OCR processing
3. OCR processing -> OCR confirmation
4. OCR confirmation -> plan success
5. plan success -> Today home
6. Today home -> task detail
7. task detail -> taken / delayed / skipped
8. Today home -> Records
9. Today home -> Therapy
10. Today home -> Settings

## 9. MVP Page Priority

P0:

- Today home
- OCR import
- OCR confirmation
- task detail
- Records
- Export
- Therapy
- medication detail
- Settings
- notification and permission

P1:

- advanced calendar interactions
- calendar integration page
- family assistance page
- help chat page

## 10. Conclusion

The page structure should be built around the loop of import -> plan generation -> daily execution -> ongoing logging -> follow-up export.

If that loop is clear, both design and implementation will stay aligned.
