# MyTherapy Core Page Specifications

## 1. Purpose

This document defines the detailed structure of the 6 most important MVP pages and is intended to directly support high-fidelity prototyping and frontend implementation.

Covered pages:

1. Today
2. Progress
3. AI
4. Me
5. My Therapy
6. OCR Confirmation

## 2. Page One: Today

### 2.1 Role

Today is the execution center of the product.

### 2.2 Goals

- help users complete daily tasks with minimal friction
- reduce daily cognitive load
- unify mixed task types in one execution view

### 2.3 Main Modules

- top status area
- horizontal date strip
- next task card
- pending task list
- collapsible completed section
- risk alert area
- floating add button

### 2.4 Page States

- empty state
- normal active state
- all-done state
- risk state

### 2.5 Key Interactions

- switch date
- open next task
- quick check-in
- expand completed tasks
- open add menu

## 3. Page Two: Progress

### 3.1 Role

Progress is the review and history center.

### 3.2 Goals

- help users understand how consistently they are following the plan
- display history and summaries
- support export

### 3.3 Main Structure

Recommended segmented control:

- Overview
- History
- Export

Overview modules:

- weekly adherence rate
- streak count
- recent task completion
- recent mood summary
- recent side effect summary
- recent metric summary

History modules:

- date-grouped record list
- each item shows type, title, scheduled time, actual time, and state

Export modules:

- date range selector
- export content selector
- export explanation
- export action

## 4. Page Three: AI

### 4.1 Role

AI is the input and understanding center of the product.

It serves as:

- OCR entry
- free-form expression entry
- rule-generation entry
- emotional outlet entry

### 4.2 Goals

- allow users to express needs before structuring them
- convert user input into rules, records, or next actions
- make OCR highly visible

### 4.3 Main Structure

- welcome area
- conversation input area
- image upload support
- quick action cards
- AI response area

Suggested quick actions:

- scan prescription / instructions
- recognize medication sheet
- record how I feel today
- help me add a reminder
- help me organize today’s treatment tasks

### 4.4 Page States

- initial empty state
- active conversation state
- OCR processing state
- AI suggestion state
- save confirmation state

## 5. Page Four: Me

### 5.1 Role

Me is the settings container and the entry point for rule management.

### 5.2 Goals

- host account, permissions, notifications, help, and therapy entry
- make low-frequency but important settings easy to find

### 5.3 Main Structure

- top profile card
- My Therapy
- reminders and notifications
- permission checks
- data and backup
- AI help and feedback
- about

## 6. Page Five: My Therapy

### 6.1 Role

My Therapy is the rule management page.

### 6.2 Goals

- manage rules that later generate Today tasks
- clearly distinguish rule type and source

### 6.3 Main Structure

Suggested sections:

- medication rules
- metric rules
- mood check rules
- symptom / side effect rules
- custom reminder rules
- appointment rules

Each rule should display:

- name
- frequency / time
- active state
- source label

Suggested source labels:

- manual
- OCR import
- AI generated
- derived from Today

## 7. Page Six: OCR Confirmation

### 7.1 Role

This is one of the most important trust-building screens in the product.

### 7.2 Goals

- let users inspect OCR results
- convert AI output into user-controlled rule drafts
- prevent risky auto-activation

### 7.3 Main Structure

- original image preview
- structured fields
- risk warning area
- action area

Suggested fields:

- medication name
- dosage
- frequency
- duration
- suggested times
- notes

Suggested actions:

- continue editing
- save to My Therapy
- handle later

## 8. Relationship Between the 6 Pages

The new main loop is:

1. user enters text or uploads an image in AI
2. moves to OCR confirmation
3. saves rules into My Therapy
4. Today generates tasks from those rules
5. user checks in through Today
6. Progress summarizes history and trends
7. Me supports long-term management and system control

## 9. Recommended Next Step

After this page-spec stage, the best next move is:

- low-fidelity wireframes
- high-fidelity prototype
- visual system definition

## 10. Conclusion

The product backbone is now clear enough to move from structure into actual interface design.
