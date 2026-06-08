---
slug: llm-mcp-performance
title: LLM with MCPs assessing application performance
date: 'March 11, 2026'
readTime: 5 min read
tags:
  - strategy
  - AI
  - MCP
excerpt: >-
  A page had a p95 response time of 32 seconds. Using an LLM agent connected to
  a prod database, Sentry, and Posthog, I diagnosed the root cause, confirmed
  the feature was barely used, and shipped a fix - dropping p95 to 600ms.
author: Jayce Garcia
sourceUrl: 'https://teotti.com/llm-with-mcps-assessing-application-performance/'
sourceName: teotti.com
---
**In short:** A page in our admin app had a p95 response time of 32 seconds. Using an LLM agent connected to our prod database, Sentry, and Posthog, I diagnosed the root cause, confirmed the feature causing it was barely used, and shipped a fix — dropping that p95 to 600ms.

At one point the agent answered a question about feature usage in 6 minutes that my team hadn’t replied to yet.

Note: I’ve kept the high-level logic intact, but I’ve obfuscated specific internal metrics and insights to respect project confidentiality.

## The setup

The setup has an agent (Claude Code in my case) looking at the app codebase (~200k lines, 15 years old) and with access to:

1.  MCP connected to the application read only prod replica database
2.  MCP connected to the app analytics (Posthog)
3.  MCP connected to the application performance monitoring (Sentry)

All an MCP does is standardize access to resources. If your tools don’t have an MCP but have at least API access to data you could build one.

![LLM with MCPs assessing application performance](/blog/llm-mcp-performance/AI-agent-assists-engineer-with-analysis.avif)

## Agentically assessing the situation

The issue reported was a response time of 20+ seconds on certain records on the admin pages. So I asked my agent to fetch data for one of these records from our application performance monitoring (Sentry).

0:00

Check sentry performance for this URL on opsnode production https://opsnode.com/admin/case\_packet/4621

0:10

Let me query Sentry for performance data on that URL.

0:12 search\_events \[sentry\]

```
{"projectSlug":"opsnode","naturalLanguageQuery":"performance spans for URL /admin/case_packet/4621, show average duration, p50, p75, p95 response times","limit":50}
```

1:28

URL-based aggregate query returned a single row with null metrics.  
Interpretation: no usable direct URL performance aggregate was found for this request path.

0:13 search\_events \[sentry\]

```
{"projectSlug":"opsnode","naturalLanguageQuery":"transaction spans for /admin/case_packet/4621, show individual request durations sorted by timestamp","limit":50}
```

1:14

No transaction results found for the literal `/admin/case_packet/4621` path.

E Enrico

Our instrumentation would only sample 10% of traffic from these paths so the direct URL lookup did not find results.

E Enrico

The agent autonomously pivoted to the web application backend name pattern Admin::CasePacketController#show. That broadened the scope from packet 4621 specifically to all case packet show-page transactions.

1:34 search\_events \[sentry\]

```
{"projectSlug":"opsnode","naturalLanguageQuery":"transaction performance for Admin::CasePacketController#show, show average duration, p50, p75, p95 response times","limit":50}
```

2:26

```
{"avg_ms":4962.84231710491,"p50_ms":924.1121826171875,"p75_ms":1765.44873046875,"p95_ms":31844.2265625,"count":28412}
```

1:35 search\_events \[sentry\]

```
{"projectSlug":"opsnode","naturalLanguageQuery":"individual transaction events for Admin::CasePacketController#show, show timestamp and duration sorted by timestamp descending","limit":50}
```

2:28

Found 50 recent transaction rows for `Admin::CasePacketController#show`.  
The result set included timestamps but not the duration detail needed for ranking slow requests.

E Enrico

The controller-level aggregate stats were available, but the individual event query lacked duration detail. The next step was to request spans with explicit duration fields and identify the slowest outliers.

2:35 search\_events \[sentry\]

```
{"projectSlug":"opsnode","naturalLanguageQuery":"transaction spans for Admin::CasePacketController#show, show timestamp, span.duration, and http.url fields, sorted by span.duration descending","limit":50}
```

3:18

Found 50 slowest controller spans with duration included.  
Top result was 84731.441208ms at 2026-02-11T15:55:02+00:00.  
Tail examples in the returned set included 15418ms on 2025-11-21 and 14972ms on 2026-01-19.

2:37 search\_events \[sentry\]

```
{"projectSlug":"opsnode","naturalLanguageQuery":"slowest transaction spans for Admin::CasePacketController#show with duration greater than 10 seconds, show timestamp, span.duration, http.url","limit":50}
```

3:10

Returned the slow-request slice for spans above 10 seconds.  
The slowest observed span was again 84731.441208ms on 2026-02-11T15:55:02+00:00.  
This confirmed a meaningful long tail of very slow requests.

2:37 search\_events \[sentry\]

```
{"projectSlug":"opsnode","naturalLanguageQuery":"average and p95 duration for Admin::CasePacketController#show grouped by week","limit":20}
```

3:27

```
{"avg_ms":null,"p95_ms":null}
```

5:02

Here's the performance data for `Admin::CasePacketController#show`.

Sentry parameterizes the transaction name, so I can't filter to packet 4621 specifically — the data below covers **all** case packet show pages.

## Aggregate Performance

| Metric | Value |
| --- | --- |
| **Total requests** | 28,412 |
| **avg** | 4,963ms (~5.0s) |
| **p50** | 924ms (~0.9s) |
| **p75** | 1,765ms (~1.8s) |
| **p95** | 31,844ms (~31.8s) |

The massive gap between p50 (0.9s) and p95 (31.8s) indicates most requests are fast, but a long tail of extremely slow requests drags the average up to ~5s.

## Top 10 Slowest Requests

| Duration | Date |
| --- | --- |
| **84.7s** | Feb 11, 2026 |
| **73.4s** | Jan 19, 2026 |
| **68.2s** | Oct 18, 2025 |
| **63.9s** | Oct 12, 2025 |
| **58.4s** | Nov 11, 2025 |
| **57.8s** | Nov 11, 2025 |
| **52.6s** | Feb 15, 2026 |
| **51.9s** | Dec 14, 2025 |
| **49.7s** | Oct 15, 2025 |
| **48.3s** | Oct 18, 2025 |

The slow requests aren't new — they've been occurring since at least Sep 2025. However, the **single worst request** (84.7s) happened on Feb 11, 2026, and there's a cluster of slow ones in late Jan/early Feb 2026 (41s on Jan 22, 33s on Jan 24, 31s on Feb 15, 52s on Feb 15).

The likely cause: certain case packets have significantly more data (attachments, records, etc.) than others, causing some show pages to be dramatically slower. Packet 4621 may be one of these heavy records.

In about 5 minutes I had my AI agent confirm this was a problem and the impact size.

![LLM with MCPs assessing application performance](/blog/llm-mcp-performance/Latency-distribution-analysis-with-AI-insight.avif)

## Local agentic iterations

In a few minutes I was able to agentically pair program and add an improvement (over an N+1 query) affecting this. At the time I still did not know how much (or little) that would change.

After some local test I saw an overall response time improvement by about 10%. Underwhelmed I asked the agent why still so slow?

Now I told the agent to look at my local development database and applications logs. Here I had the case packet reported by users and could get better insights on its poor response time. (For more on performance analysis fundamentals, [read this post](https://teotti.com/a-successful-ruby-on-rails-performance-analysis-guideline/).)

0:00

look at the service runtime logs for what queries are run for case packet: 4621, why 4.1 seconds?

0:04

Let me check the development logs for Case Packet 4621.

[Skip tool calls ↓](#cc-claude-2-4) [Skip to agent conclusions ↓](#cc-conclusion-2)

0:23 batch

```
{"pairs": 11, "tools": {"bash": 4, "read": 3, "grep": 2, "enterplanmode": 1, "task": 1}, "files": ["/srv/opsnode/.../log/runtime.log", "/srv/opsnode/.../app/controllers/ops/case_packets_controller.rb"], "commands": ["tail -1300 log/runtime.log | grep -A 7 -B 7 "case_packets/4621" | head -140", "grep -B 3 "Completed 200 OK in 6788ms" log/runtime.log | head -7", "grep -n "def archived_comments" -n app/controllers/ops/case_packets_controller.rb | head -7"]}
```

0:23

Collapsed 11 tool/result pairs.  
Completed 200 OK in 6788ms (Templates: 1749.3ms | QueryLayer: 4115.7ms (339 queries, 53 cached) | MemorySweep: 1247.0ms)  
AVOID bulk hydration detected

0:38

Initial perf readout for /ops/case\_packets/4621:

*   Total ~6.8s; QueryLayer ~4.12s across 339 queries.
*   Suspected main culprit: AuditTrail Entry/AxComment timeline queries; next step was to isolate the exact queries and call sites.

[Skip tool calls ↓](#cc-conclusion-2) [Skip to agent conclusions ↓](#cc-conclusion-2)

0:43 read

```
{"path":"/srv/opsnode/.../run-output/runr_0457pMKXRJd2LFp6Q1NzBYQ.txt"}
```

0:43

27→ AuditTrail::Entry Load (293.5ms) SELECT "audit\_entries". *FROM "audit\_entries" WHERE "audit\_entries"."entity\_kind" = 'AxComment' AND "audit\_entries"."action\_name" = 'remove'  
28→ AxComment Load (4.5ms) SELECT "ax\_comments".* FROM "ax\_comments" WHERE "ax\_comments"."pk\_id" IN (...)

0:50 read

```
{"path":"/srv/opsnode/.../run-output/runr_08LmVzq3Q9nK4RR1hJ4CrD7s.txt"}
```

0:50

... omitted 61 lines ...

1:01

## Latency Breakdown for Case Packet 4621

**Total time:** 6788ms **QueryLayer time:** 4115.7ms (339 queries, 53 cached) **Templates time:** 1749.3ms **MemorySweep time:** 1247.0ms

### ✅ Main Problem: "Case Packet Timeline" Audit Queries (~2.6s DB time)

These 3 queries are responsible for most of the slowdown:

1.  **Unscoped AuditTrail Entry query (293ms)**

*   Loads **ALL removed AxComments** for the entire system.
    *   Query:

```sql
SELECT "audit_entries".*
FROM "audit_entries"
WHERE "audit_entries"."entity_kind" = 'AxComment'
  AND "audit_entries"."action_name" = 'remove'
```

2.  **Heavy AxComment Load via `pk_id IN (...)` (772ms)**

*   Loads a huge list of AxComment records based on IDs from the audit query.
    *   Likely caused by the timeline rendering.

3.  **Serialized JSONB LIKE scan (1547ms+)**

*   This is likely the killer.
    *   It searches `audit_entries.delta_blob` (JSON text) with a LIKE condition, which forces a full scan.
    *   This is often seen when searching AuditTrail history by attributes in serialized text.

### ✅ Where It Happens

The log confirms it comes from:

**`Ops::CasePacketsController#archived_comments`** → `app/controllers/ops/case_packets_controller.rb:742`

This method is likely building the Case Packet Timeline UI section and triggering all these audit lookups.

* * *

## Recommendation

This feature is extremely expensive and likely unused. Even if optimized, querying AuditTrail serialized JSON text like this will always be slow.

✅ **Best options:**

1.  **Remove the Case Packet Timeline feature entirely**
2.  Or replace it with a much simpler audit lookup (e.g. limit to last 24 entries and avoid JSONB LIKE)

The agent came back with a breakdown of time spent on 3 main areas. One (Case Packet Timeline) I’d never heard of or even seen on the page since it was hidden behind a toggle button.

![LLM with MCPs assessing application performance](/blog/llm-mcp-performance/Case-packet-timeline-and-query-chaos.avif)

Next I asked the agent connected to an MCP with our analytics (Posthog) if anybody was actually using this “Case Packet Timeline” feature.

0:00

on posthog, check opsnode project for clicks on "Show Case Packet Timeline"

0:02

The user wants me to check PostHog for click events on "Show Case Packet Timeline" in the opsnode project. Let me use the PostHog MCP tools to search for this.

[Skip tool calls ↓](#cc-claude-3-5) [Skip to agent conclusions ↓](#cc-conclusion-3)

2:16

Listed 4 projects in org; selected target is opsnode (projectId=121697). API tokens omitted.

2:19 switch\_project \[posthog\]

```
{"projectId":121697}
```

2:24

Switched to project 121697

2:27

Now let me search for click events on "Show Case Packet Timeline".

[Skip tool calls ↓](#cc-conclusion-3) [Skip to agent conclusions ↓](#cc-conclusion-3)

2:28 toolsearch

```
{"query":"+posthog query run events","max_results":5}
```

2:28

```
{"output_missing":true}
```

2:32 query\_generate\_hogql\_from\_question \[posthog\]

```
{"question":"Count clicks on element text \"Show Case Packet Timeline\" with daily breakdown for last 30 days."}
```

6:05

Generated HogQL filtering $autocapture click events where properties.$el\_text ILIKE '%Show Case Packet Timeline%' over last 30 days; returned daily counts + total row.  
Result: total=2 clicks; 2026-01-30=1, 2026-02-13=1.

6:10

Here are the results for clicks on **"Show Case Packet Timeline"** in the opsnode project (last 30 days):

| Day | Clicks |
| --- | --- |
| 2026-01-30 | 1 |
| 2026-02-13 | 1 |
| **Total** | **2** |

Only **2 clicks** total in the last 30 days. Very low usage. Want me to expand the date range to see if there's more historical usage, or look at unique users who clicked it?

Six minutes. That’s how long it took the agent to confirm what I suspected — a feature with 2 clicks in 30 days was responsible for 30+ second page loads. I’d already asked my team on Slack. Their reply came later.

Could I have gone in to analytics to find this insight myself? Sure.

But the real advantage here is having all these data insights accessible by an agent able to make a first assessment and present that to a human that can decide the next step.

The fix was removing the unused button and its audit queries — the code responsible for those 30+ second page loads. I’ll spare you the details of that agentic loop.

A few days after deploying, I opened a fresh conversation — no prior context — and asked the agent to compare before and after.

0:00

Check sentry performance for this URL on opsnode production https://opsnode.com/admin/case\_packet/4621 before and after feb 18th

2:46 search\_events \[sentry\]

```
{"organizationSlug":"northstar-analytics","regionUrl":"https://us.sentry.io","projectSlug":"opsnode","naturalLanguageQuery":"p50, p75, p95, p99, max, avg duration and count for Admin::CasePacketController#show transaction spans from February 18 2026 to now","limit":10}
```

2:47 search\_events \[sentry\]

```
{"organizationSlug":"northstar-analytics","regionUrl":"https://us.sentry.io","projectSlug":"opsnode","naturalLanguageQuery":"p50, p75, p95, p99, max, avg duration and count for Admin::CasePacketController#show transaction spans before February 18 2026","limit":10}
```

3:43

```
{"before_feb_18":{"count":33124,"p50_ms":842.734619140625,"p75_ms":1560.218017578125,"p95_ms":31877.56640625,"p99_ms":52104.7734375,"max_ms":109884.441012,"avg_ms":4876.224561728395},"after_feb_18":{"count":1976,"p50_ms":118.33724975585938,"p75_ms":244.91287231445312,"p95_ms":612.884521484375,"p99_ms":1298.4456787109375,"max_ms":1837.772041,"avg_ms":206.11873493975903}}
```

3:52

Night and day difference. Here's the before/after comparison for `Admin::CasePacketController#show`:

| Metric | Before Feb 18 | After Feb 18 | Improvement |
| --- | --- | --- | --- |
| **p50** | 843 ms | 118 ms | **7.1x faster** |
| **p75** | 1,560 ms | 245 ms | **6.4x faster** |
| **p95** | 31,878 ms | 613 ms | **52.0x faster** |
| **p99** | 52,105 ms | 1,298 ms | **40.1x faster** |
| **Max** | 109,884 ms (~110s) | 1,838 ms (~2s) | **59.8x faster** |
| **Avg** | 4,876 ms | 206 ms | **23.7x faster** |

The performance improvement after Feb 18 is dramatic:

*   **Median response dropped from ~843ms to 118ms**
*   **The extreme outliers are completely gone** — worst case post-Feb 18 is just 1.8 seconds, vs 100+ second requests before
*   **p95 went from 31.9s to 613ms** — the long tail was nearly eliminated

Whatever change went in around Feb 18 resolved the performance issue thoroughly. The page is now consistently fast with no significant outliers.

![LLM with MCPs assessing application performance](/blog/llm-mcp-performance/Improved-admin-page-performance-comparison.avif)

## Conclusion

A lot of the conversation around AI agents in 2026 focuses on autonomy — how much can the agent do without you. I think that misses the point.

**Would you really want an agent deciding to remove a feature from your production app?** The value here wasn’t autonomy. It was reconnaissance.

In under 10 minutes the agent pulled performance data from Sentry, confirmed usage was near-zero in Posthog, and identified the exact queries dragging down response times — across three different systems I’d normally context-switch between manually. I still made every decision. I just made them faster, with better data.
