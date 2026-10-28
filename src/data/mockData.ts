import { MeetingEvent, TranscriptPreset, ExtractedActionItem, OverdueTask } from '../types';

export const INITIAL_MEETINGS: MeetingEvent[] = [
  {
    id: 'meet-1',
    title: 'Q4 Enterprise Renewal & SLA Architecture Review',
    clientName: 'Apex Health Systems',
    clientDomain: 'apexhealth.org',
    scheduledTime: '14:30',
    scheduledDate: 'Today, 2:30 PM',
    dateISO: '2026-10-28',
    isPast: false,
    durationMinutes: 45,
    location: 'Google Meet (meet.google.com/qwe-rtyu-iop)',
    briefStatus: 'ready',
    attendees: [
      { name: 'Dr. Evelyn Reed', email: 'e.reed@apexhealth.org', role: 'Chief Medical Information Officer', internal: false },
      { name: 'Markus Zimmerman', email: 'm.zimmerman@apexhealth.org', role: 'VP of Infrastructure & Security', internal: false },
      { name: 'Sarah Lin', email: 'sarah.lin@enterprise.io', role: 'Principal Account Director', internal: true },
      { name: 'Alex Rivera', email: 'alex.rivera@enterprise.io', role: 'Lead Solutions Architect', internal: true },
    ],
    transcriptPresetId: 'preset-apex',
    brief: {
      meetingId: 'meet-1',
      executiveSummary: 'Apex Health is preparing for its annual renewal ($320k ARR). Their primary focus is validating HIPAA and HL7 FHIR staging compliance, and addressing latency spikes experienced during the Sept 14 maintenance window.',
      keyObjective: 'Secure executive agreement on the multi-year SLA tier upgrade and lock in the staging benchmark timeline before Thursday’s board review.',
      attendeeDossier: [
        {
          name: 'Dr. Evelyn Reed',
          notes: 'Clinician-turned-executive. Cares deeply about zero clinical system interruption and fast physician query responses.',
          recentSentiment: 'positive',
        },
        {
          name: 'Markus Zimmerman',
          notes: 'Rigorous technical evaluator. Inquired about our SOC2 Type II bridge letter and multi-region failover tests.',
          recentSentiment: 'guarded',
        },
        {
          name: 'Sarah Lin',
          notes: 'Internal account lead. Maintained weekly check-ins with Markus; flagged potential upsell for dedicated caching pods.',
          recentSentiment: 'supportive',
        },
      ],
      recentInteractions: [
        { date: 'Yesterday, 5:12 PM', channel: 'Email', summary: 'Markus forwarded the vendor risk assessment questionnaire with 4 pending network topology items.' },
        { date: 'Oct 24, 2026', channel: 'Slack', summary: 'Confirmed staging credentials and resolved firewall whitelisting for apex-staging-vpc.' },
        { date: 'Oct 19, 2026', channel: 'Call', summary: 'Sprint sync: Delivered preliminary 99.98% uptime report for Q3.' },
      ],
      openHistoricalActions: [
        { title: 'Transmit signed BAA with updated encrypted storage rider', assignee: 'Sarah Lin', dueDate: 'Today, 5:00 PM', status: 'in-progress' },
        { title: 'Run synthetic load test against patient lookup cluster', assignee: 'Alex Rivera', dueDate: 'Tomorrow', status: 'in-progress' },
      ],
      keyMetrics: [
        { label: 'Current Contract ARR', value: '$320,000 / yr', trend: '+20% target expansion' },
        { label: 'Platform Availability', value: '99.985%', trend: 'Above 99.95% SLA' },
        { label: 'Renewal Deadline', value: '42 days remaining', trend: 'Critical decision window' },
        { label: 'Active Support Tickets', value: '0 Open P0/P1', trend: 'Clean health status' },
      ],
      recommendedTalkingPoints: [
        'Acknowledge Dr. Reed’s clinical feedback on doctor query latency and highlight the 40ms index caching upgrade.',
        'Walk through the multi-region failover drill results directly answering Markus Zimmerman’s audit question.',
        'Introduce the proposed 3-year term incentive offering 15% discount on dedicated compute infrastructure.',
        'Agree on final sign-off date for the revised Business Associate Agreement (BAA).',
      ],
    },
  },
  {
    id: 'meet-2',
    title: 'Cloud Data Pipeline Milestone & Staging Signoff',
    clientName: 'Meridian Global Capital',
    clientDomain: 'meridianglobal.com',
    scheduledTime: '16:00',
    scheduledDate: 'Today, 4:00 PM',
    dateISO: '2026-10-28',
    isPast: false,
    durationMinutes: 30,
    location: 'Zoom (ID: 894 3829 1102)',
    briefStatus: 'ready',
    attendees: [
      { name: 'Kavita Patel', email: 'kpatel@meridianglobal.com', role: 'Head of Quantitative Technology', internal: false },
      { name: 'David Chen', email: 'david.chen@enterprise.io', role: 'Senior Data Engineer', internal: true },
      { name: 'Marcus Vance', email: 'marcus.v@enterprise.io', role: 'Customer Success Manager', internal: true },
    ],
    transcriptPresetId: 'preset-meridian',
    brief: {
      meetingId: 'meet-2',
      executiveSummary: 'Meridian is validating sub-millisecond market feed ingesters. Phase 1 acceptance tests completed last Friday with 99.999% message parity. This call covers Phase 2 production cutover authorization.',
      keyObjective: 'Obtain formal signoff from Kavita Patel on the Kafka stream cluster benchmarks and establish the cutover maintenance window.',
      attendeeDossier: [
        {
          name: 'Kavita Patel',
          notes: 'High-speed algorithmic trading veteran. Emphasizes latency variance (p99 < 8ms) and data lineage immutability.',
          recentSentiment: 'positive',
        },
        {
          name: 'David Chen',
          notes: 'Internal engineering lead who authored the custom Kafka partitioner for FIX 5.0 protocol messages.',
          recentSentiment: 'supportive',
        },
      ],
      recentInteractions: [
        { date: 'Oct 26, 2026', channel: 'Email', summary: 'Kavita shared benchmark results showing 2.8 million msg/sec with zero buffer drops.' },
        { date: 'Oct 22, 2026', channel: 'Slack', summary: 'David confirmed telemetry exporter integration with Datadog dashboard.' },
      ],
      openHistoricalActions: [
        { title: 'Provide memory leak profile for long-running streaming consumers', assignee: 'David Chen', dueDate: 'Today', status: 'in-progress' },
      ],
      keyMetrics: [
        { label: 'Current Pipeline Volume', value: '4.2 TB / day', trend: 'Stable' },
        { label: 'Peak Ingest Latency', value: '4.8 ms (p99)', trend: 'Below 8ms target' },
        { label: 'Annual License Tier', value: '$240,000 / yr', trend: 'In production' },
      ],
      recommendedTalkingPoints: [
        'Review the 4.8ms p99 latency benchmark chart from Saturday\'s stress testing.',
        'Confirm the production cutover time (Sunday 02:00 EST recommended).',
        'Present the roll-back protocol and dual-write sanity check mechanism.',
      ],
    },
  },
  {
    id: 'meet-3',
    title: 'Fleet Logistics Automation & IoT Telemetry Sync',
    clientName: 'Vanguard Logistics Group',
    clientDomain: 'vanguardlogistics.com',
    scheduledTime: '10:00',
    scheduledDate: 'Tomorrow, 10:00 AM',
    dateISO: '2026-10-29',
    isPast: false,
    durationMinutes: 60,
    location: 'Microsoft Teams',
    briefStatus: 'pending',
    attendees: [
      { name: 'Robert Stirling', email: 'rstirling@vanguardlogistics.com', role: 'Chief Operating Officer', internal: false },
      { name: 'Sarah Lin', email: 'sarah.lin@enterprise.io', role: 'Principal Account Director', internal: true },
      { name: 'Alex Rivera', email: 'alex.rivera@enterprise.io', role: 'Lead Solutions Architect', internal: true },
    ],
    transcriptPresetId: 'preset-vanguard',
  },
  {
    id: 'meet-past-1',
    title: 'Q3 SLA Retrospective & Cold-Cache Architecture Review',
    clientName: 'Apex Health Systems',
    clientDomain: 'apexhealth.org',
    scheduledTime: '11:00',
    scheduledDate: 'Oct 22, 2026 (11:00 AM)',
    dateISO: '2026-10-22',
    isPast: true,
    durationMinutes: 45,
    location: 'Google Meet',
    briefStatus: 'ready',
    attendees: [
      { name: 'Dr. Evelyn Reed', email: 'e.reed@apexhealth.org', role: 'Chief Medical Information Officer', internal: false },
      { name: 'Markus Zimmerman', email: 'm.zimmerman@apexhealth.org', role: 'VP of Infrastructure & Security', internal: false },
      { name: 'Sarah Lin', email: 'sarah.lin@enterprise.io', role: 'Principal Account Director', internal: true },
    ],
    brief: {
      meetingId: 'meet-past-1',
      executiveSummary: 'Retrospective on Q3 uptime and triage latency. Markus Zimmerman requested pre-warmed cache clusters and updated SOC2 bridge documentation.',
      keyObjective: 'Present root-cause analysis for Sept 14 maintenance latency and agree on remediation milestones.',
      attendeeDossier: [
        { name: 'Dr. Evelyn Reed', notes: 'Expressed concern regarding emergency department doctor query response times.', recentSentiment: 'guarded' },
        { name: 'Markus Zimmerman', notes: 'Demanded written proof of staging cache-warming procedures.', recentSentiment: 'neutral' },
      ],
      recentInteractions: [
        { date: 'Oct 20, 2026', channel: 'Email', summary: 'Markus submitted incident report ticket with query trace samples.' },
      ],
      openHistoricalActions: [
        { title: 'Re-run synthetic load test against patient lookup cluster', assignee: 'Alex Rivera', dueDate: 'Oct 28', status: 'in-progress' },
      ],
      keyMetrics: [
        { label: 'Q3 Availability SLA', value: '99.98%', trend: 'Compliant' },
        { label: 'p99 Query Latency', value: '45 ms', trend: 'Improved' },
      ],
      recommendedTalkingPoints: [
        'Review the warm cache staging automation runbook.',
        'Address BAA encryption rider timelines.',
      ],
    },
  },
  {
    id: 'meet-past-2',
    title: 'Algorithmic Feed Ingest Benchmark & Protocol Acceptance',
    clientName: 'Meridian Global Capital',
    clientDomain: 'meridianglobal.com',
    scheduledTime: '14:00',
    scheduledDate: 'Oct 15, 2026 (2:00 PM)',
    dateISO: '2026-10-15',
    isPast: true,
    durationMinutes: 30,
    location: 'Zoom',
    briefStatus: 'ready',
    attendees: [
      { name: 'Kavita Patel', email: 'kpatel@meridianglobal.com', role: 'Head of Quantitative Technology', internal: false },
      { name: 'David Chen', email: 'david.chen@enterprise.io', role: 'Senior Data Engineer', internal: true },
    ],
    brief: {
      meetingId: 'meet-past-2',
      executiveSummary: 'Initial benchmark review of FIX 5.0 streaming partitioner. Kavita confirmed acceptance criteria of sub-8ms latency across 2M msg/sec bursts.',
      keyObjective: 'Authorize Phase 1 stress testing in dark-pool simulation sandbox.',
      attendeeDossier: [
        { name: 'Kavita Patel', notes: 'Highly impressed with message parity test metrics.', recentSentiment: 'positive' },
      ],
      recentInteractions: [
        { date: 'Oct 14, 2026', channel: 'Slack', summary: 'David shared Grafana dashboard snapshot showing 2.8M msg/sec ingest.' },
      ],
      openHistoricalActions: [],
      keyMetrics: [
        { label: 'Message Parity', value: '99.999%', trend: 'Target met' },
      ],
      recommendedTalkingPoints: [
        'Confirm testing harness schedule for weekend deployment.',
      ],
    },
  },
  {
    id: 'meet-past-3',
    title: 'Cellular Gateway Telematics & Hardware QA Checkpoint',
    clientName: 'Vanguard Logistics Group',
    clientDomain: 'vanguardlogistics.com',
    scheduledTime: '10:30',
    scheduledDate: 'Oct 8, 2026 (10:30 AM)',
    dateISO: '2026-10-08',
    isPast: true,
    durationMinutes: 45,
    location: 'Microsoft Teams',
    briefStatus: 'ready',
    attendees: [
      { name: 'Robert Stirling', email: 'rstirling@vanguardlogistics.com', role: 'Chief Operating Officer', internal: false },
      { name: 'Alex Rivera', email: 'alex.rivera@enterprise.io', role: 'Lead Solutions Architect', internal: true },
    ],
    brief: {
      meetingId: 'meet-past-3',
      executiveSummary: 'Fleet rollout review for 1,400 refrigerated trucks. Identified 6-minute polling propagation delay requiring MQTT push optimization.',
      keyObjective: 'Review hardware QA telemetry and approve firmware test cohort.',
      attendeeDossier: [
        { name: 'Robert Stirling', notes: 'Stressed cold-chain compliance penalties if temperature alerts delay.', recentSentiment: 'guarded' },
      ],
      recentInteractions: [],
      openHistoricalActions: [],
      keyMetrics: [
        { label: 'Trucks Installed', value: '1,400 units', trend: '100% complete' },
      ],
      recommendedTalkingPoints: [
        'Discuss cellular protocol switch to MQTT push.',
      ],
    },
  },
];

export const TRANSCRIPT_PRESETS: TranscriptPreset[] = [
  {
    id: 'preset-apex',
    title: 'Apex Health Systems — Q4 SLA & Renewal Discussion',
    clientName: 'Apex Health Systems',
    meetingType: 'Executive Strategy & Infrastructure Review',
    snippet: 'Dr. Evelyn Reed: "We reviewed the Q3 downtime report. The latency spikes on Sept 14 were concerning for our cardiology triage..."',
    fullTranscript: `[00:00:15] Sarah Lin: Good afternoon everyone. Thank you for making time Dr. Reed, Markus. Today we want to review the Q3 SLA metrics and walk through our infrastructure roadmap for the upcoming contract renewal.

[00:01:02] Dr. Evelyn Reed: Thanks Sarah. Let's get right into it. We reviewed the Q3 availability figures. While 99.98% is technically within SLA, the 18-minute latency spike during our Sept 14 night shift was deeply concerning for our emergency intake triage. We need reassurance that the new FHIR data pipeline won't repeat that.

[00:02:40] Alex Rivera: Completely understood, Dr. Reed. Our root cause investigation isolated that issue to a cold-cache reindex during our database version bump. We have rearchitected the deployment: all cache warming is now pre-populated across isolated staging nodes before production traffic shifts. In our simulated re-runs last Friday, p99 latency never exceeded 45 milliseconds.

[00:03:55] Markus Zimmerman: That's reassuring Alex, but I need that in writing along with the updated failover drill logs. In addition, our security audit team flagged that our Business Associate Agreement (BAA) still doesn't include the newer multi-region encryption rider. Who is handling that?

[00:04:30] Sarah Lin: I am on that, Markus. I have our updated BAA rider pre-drafted. I will send the finalized docuSign package to your legal counsel by 5:00 PM today.

[00:05:10] Markus Zimmerman: Excellent. Also, regarding the renewal pricing: if we agree to the 3-year term, we need dedicated caching instances included without the supplementary compute surcharge.

[00:05:45] Sarah Lin: If we can finalize signatures before November 15th, I have executive approval to bundle the dedicated caching nodes into your core tier at no additional surcharge.

[00:06:20] Dr. Evelyn Reed: That sounds fair. Markus, let's schedule an internal alignment call Thursday to review Sarah's proposal. 

[00:07:00] Alex Rivera: One technical action on my end: I will execute the synthetic load benchmark against the staging patient lookup cluster and deliver the benchmark PDF report to Markus by Wednesday afternoon.

[00:07:35] Markus Zimmerman: Perfect. Please also document the rollback playbook in our shared Notion workspace so my DevOps team has clear runbooks.

[00:08:10] Sarah Lin: Agreed. I will also coordinate with our finance team to deliver the formal 3-year renewal contract amendment by Friday morning.

[00:08:40] Dr. Evelyn Reed: Excellent meeting everyone. Let's reconvene next Tuesday with the deliverables in hand.`,
  },
  {
    id: 'preset-meridian',
    title: 'Meridian Global Capital — Production Stream Cutover',
    clientName: 'Meridian Global Capital',
    meetingType: 'Technical Architecture & Deployment Handoff',
    snippet: 'Kavita Patel: "The benchmark numbers from the Friday run were exceptional — 2.8 million messages per second with zero buffer drops..."',
    fullTranscript: `[00:00:10] David Chen: Welcome Kavita, thanks for joining. We have 30 minutes to review the Kafka streaming benchmarks and confirm the production cutover plan for the market feed handler.

[00:00:45] Kavita Patel: Thanks David. The benchmark numbers from Friday were exceptional. 2.8 million messages per second and our p99 latency stayed under 5 milliseconds. That exceeds our internal threshold. 

[00:01:30] David Chen: Fantastic to hear. To ensure zero disruption during trading hours, we propose scheduling the production cutover for this Sunday at 02:00 AM EST when market volumes are completely dark.

[00:02:15] Kavita Patel: That schedule works for my team. However, I need two safeguards in place before I grant final signoff: first, we must have an automated dual-write mechanism running for 48 hours to compare outputs between legacy and new feeds. Second, David, I need your team to configure automated alerts in Datadog if drift exceeds 2 microseconds.

[00:03:05] David Chen: Absolutely. I will personally build and test the Datadog alert monitors by Thursday at 3 PM, and I will submit the dual-write validation script for your team's code review by Friday morning.

[00:03:45] Marcus Vance: I will also prepare the executive change-management ticket in ServiceNow and circulate the emergency bridge dial-in for the Sunday deployment.

[00:04:20] Kavita Patel: Sounds like a solid plan. Once David's validation script is approved on Friday, I will officially sign off on the production deployment ticket.`,
  },
  {
    id: 'preset-vanguard',
    title: 'Vanguard Logistics — IoT Telemetry & Routing Milestone',
    clientName: 'Vanguard Logistics Group',
    meetingType: 'Operations Strategy & Rollout Planning',
    snippet: 'Robert Stirling: "We have 1,400 long-haul trucks equipped with the new telematics sensors. We need the geofencing alerts live by mid-month..."',
    fullTranscript: `[00:00:05] Sarah Lin: Good morning Robert. Let's review the fleet geofencing milestone and the vehicle telemetry ingestion pipeline.

[00:00:40] Robert Stirling: Morning Sarah, Alex. Here is where we stand: 1,400 long-haul trucks now have the hardware installed. However, our dispatchers are not receiving geofence breach notifications in real-time. There is currently a 6-minute propagation delay. For cold-chain refrigerated trailers, 6 minutes is unacceptable.

[00:01:35] Alex Rivera: We analyzed the delay, Robert. The bottleneck is occurring at the cellular gateway batching interval. We have a hotfix ready that switches the MQTT transmission protocol to event-driven push rather than 5-minute polling. We tested it on 50 test vehicles yesterday and delay dropped to under 4 seconds.

[00:02:40] Robert Stirling: Under 4 seconds is exactly what we need. When can that hotfix be pushed across all 1,400 units?

[00:03:05] Alex Rivera: I will coordinate the OTA (over-the-air) firmware rollout schedule with your hardware engineering director by Wednesday at 12 PM. We will execute it in 3 staggered batches over 48 hours.

[00:03:50] Sarah Lin: I will also prepare an updated SLA amendment guaranteeing sub-15 second cold-chain temperature telemetry alerts, and send that to your procurement team by Thursday.

[00:04:30] Robert Stirling: Perfect. Also, please deliver the dispatcher dashboard training video to our operations leads before Monday's shift change.

[00:05:00] Sarah Lin: Understood. Marcus on our team will record and deliver the 10-minute video walkthrough by Friday afternoon.`,
  },
];

export const INITIAL_ACTIONS: ExtractedActionItem[] = [
  {
    id: 'act-1',
    meetingId: 'meet-1',
    clientName: 'Apex Health Systems',
    title: 'Finalize and transmit updated BAA docuSign package with encryption rider',
    description: 'Ensure multi-region encryption addendum is attached and routed to Markus Zimmerman and Apex legal counsel.',
    assignee: 'Sarah Lin',
    assigneeEmail: 'sarah.lin@enterprise.io',
    dueDate: 'Today, 5:00 PM',
    priority: 'high',
    confirmed: false,
    status: 'pending_review',
    confidence: 0.98,
  },
  {
    id: 'act-2',
    meetingId: 'meet-1',
    clientName: 'Apex Health Systems',
    title: 'Deliver synthetic load benchmark PDF for patient lookup cluster',
    description: 'Execute staging stress tests simulating 5,000 req/sec and compile p99 latency curve documentation.',
    assignee: 'Alex Rivera',
    assigneeEmail: 'alex.rivera@enterprise.io',
    dueDate: 'Wednesday, Oct 29',
    priority: 'high',
    confirmed: false,
    status: 'pending_review',
    confidence: 0.95,
  },
  {
    id: 'act-3',
    meetingId: 'meet-1',
    clientName: 'Apex Health Systems',
    title: 'Document staging failover runbook in shared Notion workspace',
    description: 'Publish step-by-step instructions for cold-cache warming and DNS traffic diversion for client DevOps team.',
    assignee: 'Alex Rivera',
    assigneeEmail: 'alex.rivera@enterprise.io',
    dueDate: 'Thursday, Oct 30',
    priority: 'medium',
    confirmed: false,
    status: 'pending_review',
    confidence: 0.93,
  },
  {
    id: 'act-4',
    meetingId: 'meet-1',
    clientName: 'Apex Health Systems',
    title: 'Prepare formal 3-year renewal contract amendment with bundled caching nodes',
    description: 'Structure 15% incentive discounting dedicated caching nodes contingent on signature prior to Nov 15.',
    assignee: 'Sarah Lin',
    assigneeEmail: 'sarah.lin@enterprise.io',
    dueDate: 'Friday, Oct 31',
    priority: 'medium',
    confirmed: true,
    status: 'confirmed',
    confidence: 0.97,
  },
  {
    id: 'act-5',
    meetingId: 'meet-2',
    clientName: 'Meridian Global Capital',
    title: 'Configure automated drift threshold alert rules in Datadog',
    description: 'Create monitor triggering P1 Slack alert if FIX message timestamp delta between feeds exceeds 2 microseconds.',
    assignee: 'David Chen',
    assigneeEmail: 'david.chen@enterprise.io',
    dueDate: 'Thursday, Oct 30, 3:00 PM',
    priority: 'high',
    confirmed: true,
    status: 'synced',
    syncedTo: 'asana',
    externalId: 'asana_task_120934001',
    externalUrl: 'https://app.asana.com/0/120934001/task',
    confidence: 0.99,
  },
  {
    id: 'act-6',
    meetingId: 'meet-2',
    clientName: 'Meridian Global Capital',
    title: 'Submit dual-write validation script for Meridian code review',
    description: 'Deliver Python test harness that verifies zero message corruption over a 48-hour continuous ingestion cycle.',
    assignee: 'David Chen',
    assigneeEmail: 'david.chen@enterprise.io',
    dueDate: 'Friday, Oct 31, 10:00 AM',
    priority: 'high',
    confirmed: true,
    status: 'synced',
    syncedTo: 'notion',
    externalId: 'notion_page_78a1bc2',
    externalUrl: 'https://notion.so/workspace/client-actions/78a1bc2',
    confidence: 0.94,
  },
];

export const INITIAL_OVERDUE: OverdueTask[] = [
  {
    id: 'od-1',
    clientName: 'Meridian Global Capital',
    title: 'Deliver revised SOC2 Type II SOC bridge letter to compliance director',
    assignee: 'Sarah Lin',
    assigneeEmail: 'sarah.lin@enterprise.io',
    dueDate: 'Oct 20, 2026',
    daysOverdue: 7,
    priority: 'high',
    lastUpdate: 'Awaiting signature from external auditor',
    riskTier: 'Critical — Blocks Phase 2 expansion contract',
  },
  {
    id: 'od-2',
    clientName: 'Apex Health Systems',
    title: 'Supply HL7 FHIR staging endpoint documentation and TLS certs',
    assignee: 'David Chen',
    assigneeEmail: 'david.chen@enterprise.io',
    dueDate: 'Oct 23, 2026',
    daysOverdue: 4,
    priority: 'medium',
    lastUpdate: 'Pending sandbox schema export from QA cluster',
    riskTier: 'Moderate — Delayed client developer onboarding',
  },
  {
    id: 'od-3',
    clientName: 'Vanguard Logistics',
    title: 'Benchmark latency tests on multi-tenant warehouse gateway',
    assignee: 'Alex Rivera',
    assigneeEmail: 'alex.rivera@enterprise.io',
    dueDate: 'Oct 25, 2026',
    daysOverdue: 2,
    priority: 'high',
    lastUpdate: 'Simulations complete, drafting summary PDF',
    riskTier: 'Elevated — Review call scheduled for tomorrow',
  },
];
