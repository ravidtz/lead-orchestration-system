# ארכיטקטורת מערכת — Lead Orchestration

מערכת ניהול ליד מקצה לקצה · 14 שכבות · שילוב AI, אוטומציה ואנושיות

---

## 1. Lead Sources (מקורות לידים)
- Facebook, TikTok, Landing Forms, WhatsApp, Calls, Manual Entry
- Meta Ads, TikTok Ads
- Webhooks
- Manual Entry

## 2. Lead Ingestion Layer (שכבת קליטה)
- API endpoints, Webhook listeners, Lead parser, Deduplication, Source tagging
- REST API, Webhooks, Zapier, Make, n8n

## 3. CRM / Lead Database (בסיס נתונים)
- contacts, services, source, status, notes, history, tags, owner
- Supabase, PostgreSQL, RLS Policies, Lead ID

## 4. Orchestration Engine (מנוע אורקסטרציה)
- event-driven rules, timers, smart routing, retry logic, escalation, SLA enforcement
- Event Bus, Cron Jobs, Retry Logic, State Transitions, Priority Queue

## 5. Messaging Layer (שכבת מסרים)
- WhatsApp, SMS, Chatbot AI, Chat history, Intent detection
- Twilio, 360dialog, ChatGPT

## 6. Voice AI Layer (שכבת קול)
- Outbound / Inbound AI calls, Intent detection, Lead qualification
- Vapi, Retell AI, ElevenLabs

## 7. Interaction Logger (יומן אינטראקציות)
- messages, replies, timestamps, delivery status, read receipts
- Audit Log, Timeline

## 8. Call Events / Outcomes (אירועי שיחה)
- transcript, intent, result, failure reason, sentiment score
- Deepgram, Whisper

## 9. State Machine Layer (שכבת מצבים)
- status transitions, event triggers, audit trail, full lead history, time-in-state
- 24 States, 48 Transitions, Event-Driven, Immutable Log

## 10. Human Routing Layer (ניתוב לנציגים)
- rep assignment, queue management, SLA tracking, warm transfer, priority scoring
- Round Robin, Priority Queue, SLA Alerts, Skills-Based

## 11. Human Rep VoIP Layer (טלפוניה לנציגים)
- inbound / outbound calls, call recording, warm transfer, click-to-call, CRM popup
- Aircall, RingCentral, Vonage, Call Recording

## 12. Human Assist AI Layer (עוזר בינה מלאכותית לנציג)
- בזמן אמת: הצעות תשובה, טיפול בהתנגדויות, ניהול מידע ליד, הכוונה לסגירה
- אחרי שיחה: סיכום שיחה אוטומטי, עדכון CRM, הצעת פעולה הבאה, ניתוח ביצועים
- Claude / GPT-4, Deepgram, Real-time STT, Function Calling

## 13. Appointment / Calendar Layer (פגישות ולו"ז)
- booking flow, confirmation messages, smart reminders, no-show alerts, rescheduling
- Calendly, Google Cal, Cal.com, SMS Reminders

## 14. Post-Sale / Retention Layer (שימור ושירות)
- support flows, community, service tickets, upsell automation, repeat journey
- Support Bot, Loyalty Flow, Upsell Triggers, NPS

## 15. Business Visibility Dashboard (דשבורד ניהולי)
- Full Funnel, Lead Timeline, Rep Performance, Channel ROI, Drop-off Analysis, Real-time Alerts
- Metabase, Retool, Custom Dashboard, Live Alerts, Slack Notifications

---

המערכת משלבת שכבות טכנולוגיות מתקדמות, ניהול תהליכים אוטומטיים, בינה מלאכותית, ודגש על חווית משתמש וניהול עסקי מקצה לקצה.