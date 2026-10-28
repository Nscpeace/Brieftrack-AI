# Meeting Preparation and Action Tracking System

An end-to-end operational platform that connects client calendars, compiles context-rich pre-meeting briefing packs, extracts verified action items from post-meeting transcripts, and pushes confirmed tasks directly to Asana, Notion, or ClickUp with automated overdue tracking.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the interactive clarification phase and govern the architecture of this release:

- **Confirmed Experience Mode**: Built as an **Interactive Operations Dashboard** with live workflow execution, allowing team members to test calendar detection, live AI brief synthesis, transcript parsing, and action assignment in real time.
- **Confirmed Project Management Integration**: **Multi-Tool Selector** supporting seamless switching and schema mapping across **Asana**, **Notion**, and **ClickUp**, reflecting actual team toolchains.
- **Confirmed Transcript Ingestion Flow**: Hybrid ingestion supporting **raw transcript pasting**, **file upload (.txt, .vtt, .srt, .docx)**, and **one-click realistic client scenario presets** (e.g. Q3 Strategic Review, Product Launch Kickoff, Enterprise Renewal).
- **Security & Accuracy Safeguard (Non-Negotiable)**: Mandatory **Human Confirmation Gate** before any action item is pushed to target task management boards, preventing hallucinated deliverables or incorrect assignees from entering client queues.

---

## 1. Overview & Core Concept

### What It Does
The system solves two ubiquitous enterprise pain points: meeting participants walking into client calls without recent context (lost email threads, lingering commitments, key client metrics), and critical decisions or action items getting buried in raw call recordings.

The platform provides a dual-phase automation cycle:
1. **Pre-Meeting Intelligence (Briefing Pack Generator)**: Automatically monitors scheduled calendar events. Prior to call start, it compiles a single-page executive dossier containing attendee biographies, recent correspondence threads, active deliverables, historical meeting notes, and key business figures.
2. **Post-Meeting Execution Engine (Transcript to Task Tracking)**: Ingests call transcripts immediately after adjournments, extracts structured decisions and action items with suggested owners and due dates, routes them through a safety confirmation staging area, and synchronizes approved items with connected project workspaces.
3. **Weekly Accountability Audit**: Identifies stagnant or overdue client commitments across all active accounts and generates an executive digest for leadership.
4. **Interactive Workflow Architecture**: Visualizes the production n8n / Make.com automation blueprints and triggers so technical leads can inspect webhook contracts, Gemini prompts, and API payloads.

### Target Audience & Persona
- **Client Account Directors & Engagement Leads**: Needing instant situational awareness 15 minutes before an executive client call.
- **Project Managers & Delivery Leads**: Responsible for capturing deliverables, keeping board backlogs pristine, and ensuring no action item is dropped.
- **Operations & Agency Executives**: Overseeing client commitments across multiple accounts without manual spreadsheet auditing.

### Key Value
- Replaces 30–45 minutes of manual pre-call context gathering with an automated 60-second executive dossier.
- Closes the post-meeting accountability gap with zero lost action items and strict human-in-the-loop verification.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE OPERATIONAL LIFECYCLE                         │
└─────────────────────────────────────────────────────────────────────────────┘
  [1. Calendar Feed]         [2. Briefing Dossier]        [3. Transcript Lab]
   Upcoming client calls  ──> Context, KPIs, emails    ──> Ingest audio/text notes
                                                                   │
                                                                   ▼
  [6. Overdue Digest]        [5. Task Tool Sync]          [4. Confirmation Gate]
   Weekly audit report    <── Push to Asana/Notion/ClickUp <── Human review & edit
```

1. **Calendar & Upcoming Call Detection**: Users view detected client sessions scheduled across today and the upcoming week. Each event displays meeting title, client account name, attendee chips, time countdown, and briefing status.
2. **Pre-Meeting Brief Dossier**: Clicking any meeting reveals its executive briefing pack:
   - *Executive Summary & Objective*: Core purpose and target outcome.
   - *Attendee Context*: Client stakeholders, internal leads, recent sentiments.
   - *Recent Interactions*: Last 3 email exchange summaries and previous call takeaways.
   - *Open Historical Actions*: Pending deliverables from prior engagements.
   - *Key Figures & Metrics*: Contract values, renewal dates, project milestone status.
   - *Action Controls*: 1-click "Copy Dossier to Slack/Email", "Export PDF Brief", and "Regenerate with Gemini".
3. **Transcript Processing & Intelligence Extraction**:
   - Ingestion zone with tabs for **Client Presets** (instant loading), **Paste Transcript**, or **File Upload**.
   - One-click trigger executes structured AI parsing (powered by `gemini-3.8-flash` on server-side proxy).
   - Generates 3 synchronized outputs: Executive Meeting Summary, Strategic Decisions Log, and Extracted Action Items.
4. **Human-in-the-Loop Confirmation Gate**:
   - Interactive staging table where each candidate action item is reviewed before external synchronization.
   - Users can inline-edit action title, assign owner, adjust due date, modify priority, or dismiss false positives.
   - Batch actions: "Confirm All Validated", "Add Custom Task", "Reject Selected".
5. **Multi-Tool Task Distribution**:
   - Active destination toggle: **Asana** (List/Board format), **Notion** (Database properties view), or **ClickUp** (Spaces & Status columns).
   - Direct mock sync simulation displaying real payload schemas, task URLs, and synced status indicators.
6. **Weekly Overdue Actions Audit**:
   - Filterable accountability view grouping tasks by Client Account, Owner, and Days Overdue.
   - Generates automated weekly nudge messages and executive escalation summaries.
7. **Workflow Blueprint Inspector**:
   - Interactive n8n / Make.com flow diagram mapping webhooks, AI processing nodes, error catchers, and project tool connectors.

### Visual Identity & Theme

- **Aesthetic Direction**: High-density enterprise executive dashboard. Utilitarian, crisp, and distraction-free, engineered with strict typography hierarchy and zero decorative clutter.
- **Color Palette & Discipline (60-30-10 Rule)**:
  - *Dominant Canvas (60%)*: Crisp executive light canvas (`bg-slate-50`) paired with deep slate text (`text-slate-900`) and optical compensation for dark mode surfaces (`dark:bg-slate-950`).
  - *Structural Surfaces (30%)*: Flat container cards (`bg-white dark:bg-slate-900`) bounded by clean hairline borders (`border-slate-200 dark:border-slate-800`), eliminating nested-card clutter.
  - *Accent Budget (10%)*: High-intent Deep Indigo / Sapphire primary (`#2563EB` / `#1D4ED8`) for primary CTAs, active segmented tabs, and progress milestones.
  - *Semantic Status Tokens*: Emerald (`#16A34A`) for synced/completed, Amber (`#D97706`) for pending confirmation/due soon, and Crimson (`#DC2626`) for overdue alerts.
- **Typography & Scale**:
  - *Display / Headings*: `Plus Jakarta Sans` for modern structural authority without generic AI styling.
  - *Body Prose*: `DM Sans` / `Plus Jakarta Sans` with comfortable leading (1.55) and strict headline containment (`text-wrap: balance`).
  - *Telemetry & Dates*: Monospace tabular numerals (`font-mono tabular-nums`) across all timestamps, countdowns, and task counts.
  - *Zero-Pill Discipline*: Unboxed metadata tags using typographic dot separators (`Acme Corp · 45 mins · 4 Attendees`) instead of colored capsule badges.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Server-Side Gemini API with Structured JSON Schema
- **Chosen Approach**: Process briefing generation and transcript parsing on a secure Express server proxy (`/api/gemini/*`) using the modern `@google/genai` TypeScript SDK and `gemini-3.8-flash` with strict JSON schemas (`responseMimeType: "application/json"`).
- **Why**: Protects credentials entirely from browser bundles, guarantees deterministic JSON output for task extraction without brittle regexes, and complies with AI Studio security standards.
- **Alternatives Considered**: Direct client-side SDK invocation was rejected due to API key exposure risks and unvalidated parsing errors.

### Decision 2: Multi-Tool Adapter Architecture (Asana, Notion, ClickUp)
- **Chosen Approach**: A unified normalized `TaskItem` data model coupled with format-specific serializers for Asana (projects/sections), Notion (database properties/pages), and ClickUp (spaces/statuses).
- **Why**: Allows clients to experience the exact workflow regardless of their company's internal software stack.
- **Alternatives Considered**: Hardcoding a single tool (e.g. Asana only) would alienate Notion or ClickUp enterprise users.

### Decision 3: Realistic Client Presets with Full Custom Ingestion
- **Chosen Approach**: Ships with 3 rich, realistic enterprise scenarios (Software Enterprise Contract Renewal, Agile Product Milestone Kickoff, and Marketing Campaign Retro) while also providing raw text paste and `.txt`/file upload.
- **Why**: Delivers instant high-impact demonstration value during reviews while remaining 100% functional for the user's real client notes.
- **Alternatives Considered**: An empty dashboard requiring long manual transcript uploads on first visit creates friction and cognitive overhead.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BROWSER CLIENT (React 19)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark — View Links — Primary "Run Workflow" CTA)   │
│                                                                             │
│  ┌────────────────────┬──────────────────────────────────────────────────┐  │
│  │ Workspace Sidebar  │ Main Operational Canvas                          │  │
│  │  • Calendar Feed   │  ┌─────────────────────────────────────────────┐ │  │
│  │  • Pre-Meeting Pack│  │ Active Context Bar & Client Account Selector│ │  │
│  │  • Transcript Lab  │  └─────────────────────────────────────────────┘ │  │
│  │  • Action Staging  │  ┌─────────────────────────────────────────────┐ │  │
│  │  • Task Boards     │  │ Selected Workspace View (Brief / Staging /  │ │  │
│  │  • Overdue Audit   │  │ Multi-Tool Board / Workflow Inspector)      │ │  │
│  │  • Blueprint View  │  └─────────────────────────────────────────────┘ │  │
│  └────────────────────┴──────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼ HTTP REST / JSON                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    NODE / EXPRESS SERVER (server.ts)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Express Router & API Middlewares (/api/*)                                │
│  • Gemini Client Utility (GoogleGenAI SDK, header: 'aistudio-build')        │
│  • Routes:                                                                  │
│    - POST /api/briefs/generate        (Synthesize pre-meeting dossier)      │
│    - POST /api/transcripts/process    (Extract decisions & actions)         │
│    - POST /api/tasks/sync             (Push confirmed items to tools)       │
│    - GET  /api/reports/overdue        (Generate weekly audit digest)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    GOOGLE GEMINI API (gemini-3.8-flash)                      │
│     System Instructions + Structured JSON Schemas + Deterministic Output     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Specifications

```typescript
// Core Data Entities
interface MeetingEvent {
  id: string;
  title: string;
  clientName: string;
  clientDomain: string;
  scheduledTime: string;
  durationMinutes: number;
  attendees: Array<{ name: string; email: string; role: string; internal: boolean }>;
  briefStatus: 'ready' | 'generating' | 'pending';
  brief?: MeetingBrief;
  transcript?: string;
}

interface MeetingBrief {
  meetingId: string;
  executiveSummary: string;
  keyObjective: string;
  attendeeDossier: Array<{ name: string; notes: string; recentSentiment: 'positive' | 'neutral' | 'guarded' }>;
  recentInteractions: Array<{ date: string; channel: 'Email' | 'Slack' | 'Call'; summary: string }>;
  openHistoricalActions: Array<{ title: string; assignee: string; dueDate: string; status: 'in-progress' | 'blocked' }>;
  keyMetrics: Array<{ label: string; value: string; trend?: string }>;
  recommendedTalkingPoints: string[];
}

interface ExtractedActionItem {
  id: string;
  meetingId: string;
  clientName: string;
  title: string;
  description: string;
  assignee: string;
  assigneeEmail: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  confirmed: boolean;
  syncedTo?: 'asana' | 'notion' | 'clickup';
  externalId?: string;
  status: 'pending_review' | 'confirmed' | 'synced' | 'rejected';
}

interface DecisionLogItem {
  id: string;
  topic: string;
  decision: string;
  rationale: string;
  owner: string;
}
```

### Interactive Component & State Mapping

1. **`CalendarManager` & `UpcomingList`**:
   - Manages selected meeting, active filter (Today, Tomorrow, This Week).
   - Triggers `POST /api/briefs/generate` if dossier is not yet compiled.
2. **`BriefingPackViewer`**:
   - Interactive tabs: *Executive Overview*, *Email History*, *Open Tasks*, *Talking Points*.
   - Copy to clipboard with visual confirmation toast, print/PDF export trigger.
3. **`TranscriptWorkspace`**:
   - Ingestion editor (preset picker, raw paste area, file drop zone).
   - Progress state indicator with estimated step completion (tokenization -> summary synthesis -> decision logging -> action extraction).
4. **`ActionConfirmationGate`**:
   - Interactive table: edit title, dropdown assignee changer, calendar picker for due date, toggle priority.
   - Bulk selection checkboxes with batch confirm / batch delete actions.
5. **`ProjectToolSyncView`**:
   - Segmented view switcher: **Asana Kanban**, **Notion Database Grid**, **ClickUp List**.
   - Displays real-time API payload preview and live external sync logs.
6. **`WeeklyAuditReport`**:
   - Overdue filter (Overdue >7 days, Overdue >14 days, Approaching deadline).
   - Automated escalation copy-generator for team leads.
7. **`AutomationWorkflowDiagram`**:
   - Interactive node graph showing n8n/Make webhook triggers, Claude/Gemini AI processing steps, error boundaries, and tool webhooks.
