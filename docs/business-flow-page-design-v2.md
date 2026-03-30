# MyTherapy Business Flow and Page Design (V2)

## 1. Core Decisions in This Update

This update confirms a new top-level structure:

- Today
- Progress
- AI
- Me

This structure fits our product positioning better because:

- we are fundamentally an AI-driven patient tool
- AI is not only a support function, but a core entry point
- Therapy is better understood as a rule management layer, not a primary tab
- Me is a better container for settings, permissions, account, and therapy rule entry

## 2. New 4-Tab Definition

### 2.1 Today

Role:

- execution page
- check-in page
- the page users open most often

Core function:

- show all tasks for today
- let users complete medication, mood, symptom, and metric actions
- minimize friction in daily execution

### 2.2 Progress

Role:

- review page
- history page
- summary page

Core function:

- review records
- inspect adherence, streaks, and trends
- inspect side effect, mood, and metric summaries
- support backfill and export

### 2.3 AI

Role:

- user input page
- OCR entry
- emotional release entry
- AI conversation entry

Core function:

- recognize prescriptions and instructions
- accept free-form user input
- structure that input into usable rules
- act as a soft emotional outlet

### 2.4 Me

Role:

- settings container
- rule management entry
- account and permission page

Core function:

- handle account, permissions, notifications, and support
- contain My Therapy as a second-level rule management page

## 3. New Position of My Therapy

My Therapy is no longer a top-level tab.

It becomes an important second-level page under Me.

Its new role is:

- rule management page

It does not handle daily execution. It defines what will later appear in Today.

## 4. Data Flow Definition

The product’s core loop should now be fixed as:

1. Therapy receives data sources
2. Today executes and checks in
3. Progress reviews history

This should become the main business loop of the product.

## 5. Where Therapy Data Sources Come From

Therapy rules can come from 3 major sources:

### 5.1 Manual User Input

Users directly create:

- medications
- metrics
- mood checks
- symptom / side effect checks
- custom reminders

### 5.2 AI-Generated Input

Sources include:

- OCR of doctor instructions
- OCR of prescriptions
- OCR of medication lists
- AI conversation that turns free text into structured rules

### 5.3 Today Floating Add Entry

This supports real-time user actions such as:

- temporary medication additions
- temporary side effect checks
- custom reminders
- one-off entries that can later be saved into long-term rules

Conclusion:

- Therapy should be the unified rule sink
- no matter where data starts, it should eventually settle into Therapy rules

## 6. Updated End-to-End Logic

### 6.1 Rule Creation Stage

Rules may come from:

- manual creation
- AI OCR extraction
- AI conversation suggestions
- Today temporary additions saved into long-term rules

All of them ultimately enter:

- Me -> My Therapy

### 6.2 Daily Execution Stage

Today generates daily tasks based on Therapy rules.

Task types include:

- medication
- metrics
- mood
- symptom / side effect
- appointment
- custom reminder

Users can:

- check in
- delay
- skip
- backfill

### 6.3 Review Stage

Progress reads history and generates:

- adherence rate
- streak count
- history list
- mood summary
- side effect summary
- metric trends
- export package

## 7. Updated Information Architecture

### 7.1 Primary Navigation

1. Today
2. Progress
3. AI
4. Me

### 7.2 Secondary Structure

#### Today

- Today home
- calendar sheet
- task detail
- check-in result
- floating add menu

#### Progress

- progress overview
- history list
- side effect summary
- mood summary
- metric records
- export

#### AI

- AI conversation home
- OCR import entry
- OCR processing
- OCR confirmation
- AI structured suggestion page

#### Me

- Me home
- My Therapy
- account and profile
- reminders and notifications
- permission check
- help and feedback
- about

## 8. What the AI Tab Should Do

The AI tab should not be a generic chat screen. It should carry 4 kinds of value:

### 8.1 OCR Entry

For:

- instruction capture
- prescription capture
- medication list capture

### 8.2 Free Expression Entry

For:

- user describing current condition
- user describing discomfort
- user describing what the doctor said
- user describing a reminder they want

### 8.3 Structuring Entry

AI should convert free input into structured rules such as:

- medication rules
- mood check rules
- symptom check rules
- custom reminder rules

### 8.4 Emotional Outlet Entry

The AI tab can also serve as a soft emotional container:

- “I feel irritated today”
- “I feel a bit nauseous after medication”

The AI should not diagnose, but it can help convert that expression into records or therapy rules.

## 9. How My Therapy Should Be Designed

Since it is now a rule management page, it should feel like a rule center.

Suggested groups:

- medication rules
- metric rules
- mood check rules
- symptom / side effect check rules
- custom reminder rules
- appointment rules

Each rule should show:

- name
- frequency
- time
- status
- source

Suggested source labels:

- manual
- AI import
- OCR import
- derived from Today

## 10. How Today Should Be Designed

Today must optimize for execution speed.

Suggested structure:

1. top date and status
2. horizontal date strip
3. next task card
4. pending task list
5. collapsible completed tasks
6. floating add button

Tasks should be mixed in one list, but visually distinguishable:

- medication
- mood
- symptom
- metric
- reminder

## 11. How Progress Should Be Designed

Progress should focus on history and summary.

Suggested structure:

- top segmented control: Overview / History / Export
- Overview: adherence, streak, recent mood, recent side effects, metric summary
- History: all completed and missed tasks grouped by date
- Export: generate follow-up package

## 12. How Me Should Be Designed

Me should be more than a generic settings list. It is the configuration center.

Suggested structure:

- top profile card
- My Therapy entry
- reminders and notifications
- permission check
- data and backup
- AI help and feedback
- about

My Therapy should be positioned high because it is the rule management entry.

## 13. Key Product Principles

- Therapy defines rules
- Today executes rules
- Progress reviews results
- AI receives input and helps generate rules
- Me contains settings and rule entry

## 14. Direct Impact on Prototype Design

The next prototype phase should prioritize these 8 pages:

1. Today home
2. Progress overview
3. AI home
4. OCR confirmation
5. Me home
6. My Therapy
7. Mood check entry
8. Symptom / side effect entry

## 15. Conclusion

This update makes the product logic much clearer.

The new backbone is:

- AI collects and interprets input
- Therapy stores rules
- Today executes
- Progress reviews
- Me contains settings and rule entry

This structure better supports our positioning as an AI tool.
