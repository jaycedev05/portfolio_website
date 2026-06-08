---
slug: llm-mcp-debugging
title: Faster bug triaging with AI LLMs via MCP
date: 'February 26, 2026'
readTime: 5 min read
tags:
  - strategy
  - AI
  - MCP
excerpt: >-
  Giving AI agents access to your application source code and DB via MCP can
  enhance software debugging. In 3 minutes I reached a bug root cause in a
  15-year-old production app with around 200,000 lines of code.
author: Jayce Garcia
sourceUrl: 'https://teotti.com/simplify-software-debugging-with-llm-mcp-and-source-code/'
sourceName: teotti.com
---
**In short:** This post will show you a practical example—adapted from a real life bug—of how giving AI agents access to your application source code and DB (via MCP) can enhance software debugging.

This example shows relevant techniques for product managers and developers.

You will see a Claude code conversation of how in 3 minutes I got to a bug root cause in a 15 years old production app with around 200000 lines of code. Note: I’ve kept the high-level logic intact, but I’ve obfuscated specific internal metrics and insights to respect project confidentiality.

## The underlying (free) technology

I already wrote how to ask natural language questions using your product domain language and obtain rapid insights using AI agents your application source code and a DB MCP.

This example uses the same concept applied to finding bugs and root causes.

You’ll need:

1.  Claude code (or another agentic LLM)
2.  an MCP connected to your application production database (replica perhaps)
3.  your application source code

If you need more setup hints take a peak at my other [post](https://teotti.com/generate-product-insights-with-ai-agent-db-mcp-and-app-sourcecode/).

This approach will get you to a bug root cause based on live db data (connected via MCP) and facilitate the creation of a data driven story/bug to track work.

**A human is still very much needed** but through the example timestamps you’ll see how much faster this approach is.

![Faster bug triaging with AI LLMs via MCP](/blog/llm-mcp-debugging/human_operator_ai_agent.avif)

## The outcome

In the original work that inspired this blog post the agent was able to find the record connected to our production replica, look at the application source code (a 15+ years old Ruby app), confirm the issue’s root cause and even take the initiative and suggest a solution.

From there I proceeded to create a bug ticket in our issue tracking with all the context and data collected.

This was a relatively simple issue but the conclusion is this approach leads to a roughly 5 minutes triage.

It would not have taken a human 5 minutes.

## Bug triaging without AI

In the past (I am speaking with a 17+ years background in hands on full stack development and about 8 in product) triaging a bug meant reproducing it or allocating timeboxed dev effort, assessing how many users were impacted, and writing a bug report with steps and example data. On the engineering side that meant digging into the production db, finding the record, possibly moving data locally to reproduce the issue, making an educated guess, and writing a test to confirm it. Each step compounds the time.

## The advantage of AI enhanced bug triaging

When an agent has access to your source code and your db you’ll be able to ask natural language questions using your business domain language and live data to get to a **much faster bug triage and root cause analysis backed by examples and data**.

## The concrete example

Let’s say an operator of your software notices the comments for inquiry tickets 42785 are showing up in random order. But showing up in the correct order for other tickets.

So with an AI agent + source code (or Repomix) + DB MCP (with a read only connection to your app db) you could ask your LLM:

0:00

Look at the /console/inquiry\_tickets page, use request 42785 as an example. How are these records comments displayed? In what order? Use the kepler db live replica

0:04

I'll explore the codebase to understand how inquiry ticket comments are displayed and check the database for request 42785.

[Skip to human interaction ↓](#cc-human-1-19) [Skip to agent conclusions ↓](#cc-conclusion-1)

0:07 task

```
{"task":"Find inquiry ticket comments code"}
```

0:08 execute\_sql \[keplerdb\_live\_replica\]

```
{"sql":"SELECT * FROM inquiry_tickets WHERE uid = 42785;"}
```

1:13

*   Task output: located key admin/controller/view/model/JS involved in inquiry comments; comments are polymorphic, user-attributed, modal-based add/edit; comment content is searchable via ransack; audit/history via PaperTrail; agentId d7c9b2a.
*   SQL output: inquiry\_tickets uid=42785 returned 1 row (phase ACTIVE, status\_code 7; inserted\_at 2025-09-11; modified\_at 2026-02-14; submitted\_on 2025-09-11; next\_followup\_on 2026-02-20).

E Enrico

Here the agent has collected the info it needed and will continue to dig deeper in how this (Ruby on Rails) application displays those comments I am interested in.

1:16

Plans next verification steps: query `ticket_comments` for request 42785 and inspect the view partial responsible for rendering comments to confirm display iteration and ordering behavior.

[Skip tool calls ↓](#cc-claude-1-11) [Skip to human interaction ↓](#cc-human-1-19) [Skip to agent conclusions ↓](#cc-conclusion-1)

1:18 execute\_sql \[keplerdb\_live\_replica\]

```
{"sql":"SELECT tc.*, a.email_addr AS author_email, a.given_name, a.family_name FROM ticket_comments tc LEFT JOIN staff_accounts a ON tc.author_id = a.uid WHERE tc.commentable_uid = 42785 AND tc.commentable_type = 'InquiryTicket' ORDER BY tc.uid;"}
```

1:18 read

```
{"path":"/home/agentx/dev_workspace/orion/kepler/app/views/ticket_comments/_in_form.html.erb"}
```

1:18

SQL returned 4 ticket\_comments for InquiryTicket(42785), ordered by tc.uid asc:

*   904 (2025-09-12): "Q091702-091225" — Alina Cordova
*   1321 (2025-10-02): response ETA ~11/28/2025 — Alina Cordova
*   1788 (2026-01-09): partial denial + new anticipated completion date text — Alina Cordova
*   1834 (2026-02-14): points to OpenData Mesa portal — Alina Cordova

1:19

View partial loops comments with no explicit order:

*   `commentable.ticket_comments.includes(:author).each do |comment|`
*   Renders `simple_format(render_comment(comment))`
*   Per-comment edit (modal) + delete controls; also provides an "Add Comment" modal + textarea for new comments.

1:22

Checks model/association definitions to see whether any default ordering exists (e.g., default\_scope or ordered has\_many) that could explain/guarantee comment ordering.

[Skip to human interaction ↓](#cc-human-1-19) [Skip to agent conclusions ↓](#cc-conclusion-1)

1:22 read

```
{"path":"/home/agentx/dev_workspace/orion/kepler/app/models/ticket_comment.rb"}
```

1:23 read

```
{"path":"/home/agentx/dev_workspace/orion/kepler/app/models/inquiry_ticket.rb"}
```

1:23

TicketComment model: polymorphic belongs\_to + belongs\_to author; validations; ransackable attrs/associations; no default ordering/default\_scope present.

1:23

InquiryTicket model: has\_many ticket\_comments as polymorphic association (dependent: :destroy) with no explicit `-> { order(...) }` clause shown.

E Enrico

And it lands on its first--sort of wrong--conclusion: "Comments are displayed in ascending order by uid"

1:41

Based on my analysis of the code and database, here's how inquiry ticket comments are displayed:

## Comments Display for Inquiry Ticket 42785

### Display Order

Comments are displayed in **ascending order by `uid`** (which is effectively **chronological order - oldest first**). There is no explicit ordering defined in either:

*   The `TicketComment` model (ticket\_comment.rb:1-18) - no `default_scope`
*   The `has_many` association in `InquiryTicket` (inquiry\_ticket.rb:41) - `has_many :ticket_comments, as: :commentable, dependent: :destroy`
*   The view partial (\_in\_form.html.erb:3) - `commentable.ticket_comments.includes(:author).each`

Rails defaults to primary key ascending when no order is specified.

### Request 42785 Comments (4 total)

ID

Created

Content

User

904

2025-09-12

omitted

Alina Cordova

1321

2025-10-02

omitted

Alina Cordova

1788

2026-01-09

omitted

Alina Cordova

1834

2026-02-14

omitted

Alina Cordova

### View Implementation

The comments are rendered in \_in\_form.html.erb which:

1.  Iterates through `ticket_comments` with author includes (line 3)
2.  Displays each comment's content with `simple_format(render_comment(comment))` (line 6)
3.  Shows edit (pencil icon) and delete (trash icon) buttons for each comment (lines 8-13)
4.  Provides modals for editing existing comments and adding new ones

[Skip to human interaction ↓](#cc-human-1-19) [Skip to agent conclusions ↓](#cc-conclusion-1)

E Enrico

Here's where most of the time was spent: checking a response that we could summarize as "they're displayed in sequential order". That felt wrong. I had used an open prompt intentionally — "How are these records comments displayed?" — not to bias the AI towards the bug. I wanted to observe its reasoning before stepping in. Now, that moment had arrived.

5:33

why would I be seeing comments in this order: 20250912, 20260214, 20251002, 20260109 ?

5:44

Flags the observed order as inconsistent with `uid` or `inserted_at`, and shifts investigation to how comments are loaded (controller/query) and whether the client (JS) reorders comments post-render.

5:45 read

```
{"path":"/home/agentx/dev_workspace/orion/kepler/app/controllers/admin/inquiry_tickets_controller.rb"}
```

5:46 grep

```
{"pattern":"ticket_comments","path":"/home/agentx/dev_workspace/orion/kepler/app","output_mode":"content","-n":true}
```

5:47

*   Admin::InquiryTicketsController: uses `.includes(..., ticket_comments: :author)` in index/paginated results; no explicit `.order(...)` applied to comments in the shown query path.
*   Grep: confirmed multiple render points calling `render('ticket_comments/in_form', ...)` and loops like `commentable.ticket_comments.includes(:author).each` (no order); JS controller hits `/ticket_comments` endpoints; updater job creates comments.

E Enrico

After wrapping up the checks on the backend code it moved on to the frontend code in this case Rails's Stimulus JavaScript framework.

5:55

Having found no server-side ordering in controller/includes, checks the Stimulus controller to confirm whether comments are being sorted/reordered client-side.

[Skip tool calls ↓](#cc-claude-1-28) [Skip to agent conclusions ↓](#cc-conclusion-1)

5:56 read

```
{"path":"/home/agentx/dev_workspace/orion/kepler/app/javascript/controllers/admin/inquiry_tickets_controller.js"}
```

5:56

Stimulus controller contains no comment-sorting logic; behavior is primarily modal handling + Turbo/page refresh after create/update, implying the displayed comment order is driven by the DB/query unless explicitly ordered.

6:19

Probes the TicketCommentsController and runs targeted SQL to test whether ordering could be influenced by timestamps (e.g., `modified_at`) versus truly unordered retrieval.

[Skip tool calls ↓](#cc-claude-1-33) [Skip to agent conclusions ↓](#cc-conclusion-1)

6:21 read

```
{"path":"/home/agentx/dev_workspace/orion/kepler/app/controllers/ticket_comments_controller.rb"}
```

6:22 execute\_sql \[keplerdb\_live\_replica\]

```
{"sql":"SELECT uid, inserted_at, modified_at, body FROM ticket_comments WHERE commentable_uid = 42785 AND commentable_type = 'InquiryTicket' ORDER BY modified_at DESC;"}
```

6:22

TicketCommentsController is CRUD-style (create/update/destroy) and redirects back; no ordering logic for fetching comments is defined here.

6:23

SQL ordered by modified\_at desc returns: 1834, 1788, 1321, 904 (matches chronological newest-first by timestamps for this dataset).

6:38

Verifies the key hypothesis: without an explicit `ORDER BY`, the DB can return rows in a non-chronological, non-uid order; runs a control query without ordering to replicate the UI's "weird" sequence.

6:39 execute\_sql \[keplerdb\_live\_replica\]

```
{"sql":"SELECT uid, inserted_at, body FROM ticket_comments WHERE commentable_uid = 42785 AND commentable_type = 'InquiryTicket';"}
```

6:40

Unordered SELECT returns rows in this (non-deterministic) order: 904, 1834, 1321, 1788 — aligning with the observed "out-of-order" display when the app does not specify ordering.

E Enrico

After that final round of checks the agent comes back with its correct assessment.

6:54

That confirms it. The database returns records in this order without `ORDER BY`:

*   904 (Sep 12, 2025)
*   1834 (Feb 14, 2026)
*   1321 (Oct 02, 2025)
*   1788 (Jan 09, 2026)

## Root Cause

**There is no explicit ordering defined for `ticket_comments` anywhere in the code:**

1.  **Model** (ticket\_comment.rb) - No `default_scope` with ordering
2.  **Association** (inquiry\_ticket.rb:41) - `has_many :ticket_comments` has no `-> { order(...) }` clause
3.  **View** (\_in\_form.html.erb:3) - `commentable.ticket_comments.includes(:author).each` has no `.order()`

Without an explicit `ORDER BY`, PostgreSQL returns rows in **heap order** (physical storage order on disk). This order is:

*   Not deterministic
*   Can change after UPDATEs, VACUUMs, or database maintenance
*   Not the same as `uid` or `inserted_at` order

The order you're seeing (904 → 1834 → 1321 → 1788) is simply where those rows happen to be stored physically in the `ticket_comments` table right now.

The initial response from the agent contradicted what was reported, so I had to challenge it. **That’s why you need a human**.

![Faster bug triaging with AI LLMs via MCP](/blog/llm-mcp-debugging/human_operator_bug_pointing.avif)

The total time to resolution was 7 minutes. Agent time was about 3 minutes, the rest was my check halfway.

While writing this blog post I ran a few tests with the same initial prompt and compared to a loaded one that asked:

Look at the page, use request 42785 as an example. How are these records notes displayed? In what order? Why would I be seeing comments in this order: 20250912, 20260214, 20251002, 20260109?

0:01

Thinking... \[Response omitted\]

I am skipping that conversation but suffice to say it took the agent 1 minute 30 seconds and landed on the same conclusion (missing order by) without requiring my intervention. It did not mention the [Postgres order](https://www.postgresql.org/docs/current/queries-order.html) issue.

Some might prefer that style of more targeted prompt. I personally prefer to not bias the agent and see its conclusions before intervening.

## Conclusion

I think we can agree it’d take longer than 3 minutes for a human alone to get to the root cause even for a simple bug like this. And this approach scales — the more complex the bug, the more time an agent saves digging through layers of code and data you’d otherwise chase manually.

The ultimate advantage is freeing up your mental space for more interesting work.

Using AI agents and MCP to aid debugging is a human-enhancing approach. It requires a human paying attention to detail and challenging the AI when its answers raise an eyebrow. Ignoring that element would do a disservice to what makes this technology genuinely powerful.

How you proceed with the bug fix is a topic for an upcoming post — stay tuned.
