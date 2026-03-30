# MyTherapy Home and OCR Core Flow

## 1. Purpose

This document defines the two most important MVP experiences:

- the Today home execution experience
- the AI OCR import and confirmation experience

These are the highest-priority foundations for prototype and UI design.

## 2. Why These Two Flows Matter Most

For MyTherapy, product success will not be decided by settings depth. It will be decided by two things:

- whether users can smoothly turn medical instructions into a plan
- whether users can complete daily medication actions easily from the home screen

That means the home flow and OCR flow must feel:

- clear
- fast
- trustworthy
- confirmable

## 3. Core Goal of the Home Screen

The home screen should answer one main question:

“What do I need to do today, right now?”

It should not primarily answer:

- how did I perform this week
- what settings are available
- what extra utilities can I explore

Those belong later in the product.

## 4. Recommended Home Structure

Recommended order from top to bottom:

### 4.1 Top Information Area

Include:

- page title: Today
- same-day status summary
- calendar entry
- notification / permission issue entry

### 4.2 Horizontal Date Strip

Purpose:

- quick switching between days
- reinforce continuity and habit behavior

Requirements:

- current date highlighted
- horizontally scrollable
- refresh tasks when selected

### 4.3 Next Dose Card

Purpose:

- use one high-priority card to show the nearest action

Suggested content:

- medication name
- time
- dosage
- before/after meal note
- quick action button

### 4.4 Pending Tasks for Today

Purpose:

- show remaining tasks
- support sequential completion

Suggested task row content:

- time
- medication name
- dosage
- state
- tap to detail

### 4.5 Collapsible Completed Tasks

Purpose:

- preserve completion feedback
- reduce visual noise

This section should be collapsed by default.

### 4.6 Risk Alert Area

Include:

- low inventory
- reminder reliability warning
- missing side effect entry reminders

These alerts should be clear, but should not overpower the main task flow.

### 4.7 Floating Add Button

Recommended action order:

1. scan prescription / instructions
2. add medication manually
3. add metric record
4. add side effect record

## 5. Home Interaction Principles

- users must know within 3 seconds whether there is a task today
- users must be able to start the next medication action within 1 tap
- completed and pending states must be clearly distinct
- abnormal reminder states must be visible
- no ads in the main home task flow

## 6. Core Goal of the OCR Flow

The OCR flow must answer one trust question:

“Can the user safely let AI help generate a medication plan?”

That means the flow must emphasize:

- AI is assisting extraction only
- users can edit the result
- nothing becomes active before confirmation

## 7. Recommended OCR Steps

### 7.1 Import Page

Goal:

- let the user start fast

Modules:

- camera button
- upload button
- guidance copy explaining supported documents

### 7.2 Processing Page

Goal:

- set expectations during wait time

Modules:

- processing animation
- support copy
- reminder that results must be confirmed

### 7.3 Confirmation Page

Goal:

- convert AI output into user-controlled structured data

Most important fields:

- medication name
- dosage
- frequency
- duration
- notes

Requirements:

- fields editable inline
- missing fields can be added manually
- uncertain fields must be highlighted
- original image can be reviewed

### 7.4 Success Page

Goal:

- confirm that the plan is ready
- return the user to Today for execution

## 8. OCR Confirmation Design Principles

- the page must not feel like AI made the decision automatically
- uncertain content must be explicit
- editing must feel simple and safe
- the primary CTA should clearly say confirm and generate plan

## 9. Our Key Difference from the Reference Product

The reference product is stronger in post-plan execution management.

Our product must more strongly emphasize:

- the first-time instruction import experience
- the AI-assisted plan creation experience
- the conversion from import into daily execution

That means our first screen and creation entry points should emphasize OCR much more clearly.

## 10. Prototype Recommendation

These 5 pages should be designed first:

1. Today home
2. calendar sheet
3. OCR import page
4. OCR confirmation page
5. task detail page

If these 5 pages work well, the main MVP loop is already proven structurally.

## 11. Conclusion

The MVP will mostly succeed or fail based on two experiences:

- whether users trust us with their medical instructions
- whether they return to the home screen every day to execute and log actions

That is why the home flow and OCR flow should be the highest-priority design work.
