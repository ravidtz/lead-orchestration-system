# Lead State Machine — Lead Flow

24 מצבים · 48 מעברים · ניהול ליד מלא

---

## מצבים עיקריים (Lead States)
- **NEW** — ליד נוצר
- **CONTACTED** — פנייה ראשונה
- **ENGAGED** — לקוח ענה
- **NO_TEXT_RESPONSE** — אין תגובה
- **QUALIFIED** — ליד מוסמך
- **VOICE_ENGAGED** — ענה לשיחה
- **DISQUALIFIED** — לא רלוונטי
- **BOOKING_IN_PROGRESS** — בתהליך הזמנה
- **HUMAN_ENGAGED** — נציג אנושי
- **RETRY_PENDING** — ניסיון חוזר
- **FOLLOW_UP_REQUIRED** — דרוש מעקב
- **BOOKED** — פגישה נקבעה
- **CONFIRMATION_PENDING** — ממתין לאישור
- **CONFIRMED** — אישר הגעה
- **RESCHEDULED** — נקבע מחדש
- **SHOW** — הגיע לפגישה
- **NO_SHOW** — לא הגיע
- **CLOSED_WON** ✓ — עסקה נסגרה
- **CLOSED_LOST** ✗ — ליד אבד
- **POST_SALE** — אחרי מכירה
- **DORMANT** — רדום
- **RETENTION** — שימור לקוח
- **SERVICE_ACTIVE** — שירות פעיל
- **ARCHIVED** — ארכיב

---

## דוגמאות למעברים (Transitions)
- **Entry → NEW**
- **NEW → CONTACTED** (פנייה ראשונה)
- **CONTACTED → ENGAGED** (לקוח ענה)
- **CONTACTED → NO_TEXT_RESPONSE** (אין תגובה לאחר זמן מוגדר)
- **ENGAGED → QUALIFIED** (סינון והכשרה)
- **QUALIFIED → BOOKING_IN_PROGRESS** (התחלת תהליך הזמנה)
- **BOOKING_IN_PROGRESS → BOOKED** (פגישה נקבעה)
- **BOOKED → CONFIRMATION_PENDING** (ממתין לאישור)
- **CONFIRMATION_PENDING → CONFIRMED** (אישור הגעה)
- **CONFIRMED → SHOW** (הגיע לפגישה)
- **CONFIRMED → NO_SHOW** (לא הגיע)
- **SHOW → CLOSED_WON** (עסקה נסגרה)
- **NO_SHOW → RETRY_PENDING** (ניסיון חוזר)
- **RETRY_PENDING → FOLLOW_UP_REQUIRED** (דרוש מעקב)
- **FOLLOW_UP_REQUIRED → DORMANT** (רדום)
- **CLOSED_WON → POST_SALE** (אחרי מכירה)
- **POST_SALE → RETENTION** (שימור לקוח)
- **RETENTION → SERVICE_ACTIVE** (שירות פעיל)
- **SERVICE_ACTIVE → ARCHIVED** (ארכיב)
- **כל מצב → DISQUALIFIED / CLOSED_LOST** (ליד נפסל או אבד)

---

## מסלולים עיקריים
- **Success path:** NEW → CONTACTED → ENGAGED → QUALIFIED → BOOKING_IN_PROGRESS → BOOKED → CONFIRMATION_PENDING → CONFIRMED → SHOW → CLOSED_WON → POST_SALE → RETENTION → SERVICE_ACTIVE → ARCHIVED
- **Failure path:** בכל שלב ניתן לעבור ל-DISQUALIFIED או CLOSED_LOST
- **Follow-up:** NO_TEXT_RESPONSE, RETRY_PENDING, FOLLOW_UP_REQUIRED, DORMANT

---

המסמך מתאר את כל מצבי הליד, דוגמאות למעברים עיקריים, ומסלולי הצלחה/כישלון/מעקב, כחלק ממכונת מצבים מלאה לניהול לידים.