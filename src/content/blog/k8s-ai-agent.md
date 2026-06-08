---
slug: k8s-ai-agent
title: Using an AI agent to navigate an undocumented Kubernetes repo
date: 'April 17, 2026'
readTime: 5 min read
tags:
  - AI
  - MCP
excerpt: >-
  A demo environment behaved differently from production because a Kubernetes
  CronJob existed only in the production overlay. An AI agent helped trace the
  CronJob, map stage to the demo environment, and identify the IaC files that
  needed changing.
author: Jayce Garcia
sourceUrl: >-
  https://teotti.com/using-an-ai-agent-to-navigate-an-undocumented-kubernetes-repo/
sourceName: teotti.com
---
**In short:** A demo environment behaved differently from production because a Kubernetes CronJob existed only in the production overlay.

The infrastructure repo had little documentation, and the environment names were ambiguous: `stage` and `staging` both existed.

An AI agent helped me trace the CronJob, map `stage` to the demo environment, and identify the two IaC files that needed changing.

The useful part was not that the agent “knew Kubernetes.” It could inspect the repo faster than I could, compare patterns across overlays, and keep the environment-specific details visible while I reviewed the result.

Note: I’ve kept the high-level logic intact, but I’ve altered specific internal names and insights to respect project confidentiality.

I was working with a client that had 5 application repositories and one Kubernetes infrastructure-as-code repo.

The IaC repo managed application deployments, environment config, and operational automation through GitOps. It had very little documentation.

I had changed one of the applications and needed to test the behavior on the demo environment. The change depended on a CronJob called `archive_lapsed_memberships`.

Locally, I could run the task manually. In production, the CronJob existed. On demo, the behavior never happened.

I am not a Kubernetes specialist. Waiting for the part-time DevOps team would have meant a long turnaround, so I opened the IaC repo in my agent and started asking questions.

## Finding the missing CronJob

The first step was locating the CronJob. I did not know whether it lived in the application repo, the GitOps repo, or some older Kubernetes directory.

Finding the CronJob was the easy part. The harder question was whether the demo environment used the same overlay. The repo had both `stage` and `staging`, which is not exactly an intention revealing naming scheme.

Once the agent mapped `stage` to the demo domain, I had enough context to ask for the actual change.

What follows is a redacted chat I had with the agent. You can skip through the transcript sections if you only want the final change.

0:00

can you tell me where the "add archive\_lapsed\_memberships" cronjob is defined?

0:04 grep

```
{"pattern":"archive_lapsed_memberships"}
```

0:04

Found 4 files  
gitops/taskhub-core/overlays/prod/timers.yaml  
kubernetes/prod-cluster/default/timers.yaml  
opslane-bundle.xml  
bundle-output.xml

0:08 grep

```
{"pattern":"archive_lapsed_memberships","path":"gitops/taskhub-core/overlays/prod/timers.yaml","output_mode":"content","-B":5,"-A":5}
```

0:08

426- imagePullPolicy: Always  
427- command:  
428- - bundle  
429- - exec  
430- - rake  
431: - taskhub:archive\_lapsed\_memberships  
432- envFrom:  
433- - configMapRef:  
434- name: env  
435- env:  
436- - name: APP\_MASTER\_KEY

0:11 grep

```
{"pattern":"archive_lapsed_memberships","path":"gitops/taskhub-core/overlays/prod/timers.yaml","output_mode":"content","-B":20}
```

0:11

411----  
412-apiVersion: batch/v1  
413-kind: CronJob  
414-metadata:  
415- name: archive-lapsed-membership  
416-spec:  
417- suspend: False # Enable when prod  
418- schedule: "30 11 \*"  
419- jobTemplate:  
420- spec:  
421- template:  
422- spec:  
423- containers:  
424- - name: archive-lapsed-membership  
425- image: northstarlabs/taskhub:stable  
426- imagePullPolicy: Always  
427- command:  
428- - bundle  
429- - exec  
430- - rake  
431: - taskhub:archive\_lapsed\_memberships

0:16

The cronjob is defined in [timers.yaml:412-431](gitops/taskhub-core/overlays/prod/timers.yaml#L412-L431). It's a Kubernetes CronJob named `archive-lapsed-membership` that:

*   Runs daily at **11:30 UTC** (`30 11 *`)
*   Is **active** (not suspended)
*   Executes `bundle exec rake taskhub:archive_lapsed_memberships`

There's also an older copy at kubernetes/prod-cluster/default/timers.yaml.

[Skip to human interaction ↓](#cc-human-1-9) [Skip to agent conclusions ↓](#cc-conclusion-1)

E Enrico

After locating the cronjob, I wonder if it runs on all stages.

0:38

does it run on all stages?

0:41 grep

```
{"pattern":"archive_lapsed_memberships","path":"gitops/taskhub-core/overlays"}
```

0:41

Found 1 fileg  
gitops/taskhub-core/overlays/prod/timers.yaml

0:44

No — it only runs in **prod**. There's no definition for it in any other overlay (e.g., staging).

1:19

what overlays are defined for that app?

1:22 bash

```
{"command":"ls /home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/","description":"List overlay directories"}
```

1:24

prod  
stage  
staging

1:27

Three overlays: **prod**, **stage**, and **staging**.

[Skip to human interaction ↓](#cc-human-1-18) [Skip to agent conclusions ↓](#cc-conclusion-1)

E Enrico

The poor name definition (I dare you to intuitively know what's the difference between stage and staging) drove my next question.

1:46

what's the difference between stage and staging?

1:50 bash

```
{"command":"ls /home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/","description":"List stage overlay contents"}
```

1:50 bash

```
{"command":"ls /home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/staging/","description":"List staging overlay contents"}
```

1:51

edge-gateway-cm.yaml  
settingsmap.yaml  
cronjobs  
cloud-secrets.enc.yaml  
debugkit.yaml  
gateway.yaml  
manifest.yaml  
hostbackupsecret.enc.yaml  
patch-service.yaml  
blob-sync-job.yaml  
appsecret.yaml  
taskhub-api-service.yaml  
taskhub-hpa.yaml  
processor-hpa.yaml

1:51

edge-gateway-cm.yaml  
settings.yaml  
cronjobs  
cloud-secrets.enc.yaml  
gateway.yaml  
manifest.yaml  
hostbackupsecret.enc.yaml  
patch-service.yaml  
appsecrets.yaml  
taskhub-api-service.yaml  
taskhub-hpa.yaml  
taskhub-oneoff.yaml  
processor-hpa.yaml

2:11

They're very similar — both are staging-like overlays with mostly the same files. Let me check the key differences.

[Skip tool calls ↓](#cc-claude-1-28) [Skip to human interaction ↓](#cc-human-1-30) [Skip to agent conclusions ↓](#cc-conclusion-1)

2:13 grep

```
{"pattern":"namespace|host","path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/manifest.yaml","output_mode":"content"}
```

2:13 grep

```
{"pattern":"namespace|host","path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/staging/manifest.yaml","output_mode":"content"}
```

2:13

12:namespace: taskhub-core

2:13

12:namespace: taskhub-core-staging

2:18

The key difference is the **namespace**:

*   **stage** → namespace `taskhub-core` (shares the default namespace)
*   **staging** → namespace `taskhub-core-staging` (has its own dedicated namespace)

They appear to be two separate staging environments deployed to different Kubernetes namespaces. The `staging` overlay looks like a more isolated environment with its own namespace.

[Skip to human interaction ↓](#cc-human-1-30) [Skip to agent conclusions ↓](#cc-conclusion-1)

E Enrico

The agent pointed out some differences in how those overlays were setup but my focus wasn't on refactoring that. Was to understand to which overlay to add the cronjob.

2:29

what domains are linked to those?

2:33 read

```
{"path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/gateway.yaml"}
```

2:33 read

```
{"path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/staging/gateway.yaml"}
```

2:33

10→apiVersion: networking.k8s.io/v1  
11→kind: Ingress  
12→metadata:  
13→ name: taskhub-core-ingress  
14→ annotations:  
15→ service.beta.kubernetes.io/linode-loadbalancer-default-proxy-protocol: v1  
16→ nginx.ingress.kubernetes.io/proxy-body-size: "100m"  
17→ nginx.org/client-max-body-size: "100m"  
18→ cert-manager.io/cluster-issuer: acme-prod  
19→ namespace: default  
20→spec:  
21→ ingressClassName: nginx  
22→ tls:  
23→ - hosts:  
24→ - demo.taskhub-center.net  
25→ - api.demo.taskhub-center.net  
26→ secretName: k8s-check-taskhub-center-net  
27→ rules:  
28→ - host: demo.taskhub-center.net  
29→ http:  
30→ paths:  
31→ - pathType: Prefix  
32→ backend:  
33→ service:  
34→ name: app  
35→ port:  
36→ number: 3100  
37→ path: /  
38→ - host: api.demo.taskhub-center.net  
39→ http:  
40→ paths:  
41→ - pathType: Prefix  
42→ backend:  
43→ service:  
44→ name: edge-gateway  
45→ port:  
46→ number: 8180  
47→ path: /

2:33

10→apiVersion: networking.k8s.io/v1  
11→kind: Ingress  
12→metadata:  
13→ name: taskhub-core-staging-ingress  
14→ annotations:  
15→ service.beta.kubernetes.io/linode-loadbalancer-default-proxy-protocol: v1  
16→ nginx.ingress.kubernetes.io/proxy-body-size: "100m"  
17→ nginx.org/client-max-body-size: "100m"  
18→ cert-manager.io/cluster-issuer: acme-prod  
19→spec:  
20→ ingressClassName: nginx  
21→ tls:  
22→ - hosts:  
23→ - staging.taskhub-center.net  
24→ - api.staging.taskhub-center.net  
25→ secretName: k8s-check-taskhub-center-net  
26→ rules:  
27→ - host: staging.taskhub-center.net  
28→ http:  
29→ paths:  
30→ - pathType: Prefix  
31→ backend:  
32→ service:  
33→ name: app  
34→ port:  
35→ number: 3100  
36→ path: /  
37→ - host: api.staging.taskhub-center.net  
38→ http:  
39→ paths:  
40→ - pathType: Prefix  
41→ backend:  
42→ service:  
43→ name: edge-gateway  
44→ port:  
45→ number: 8180  
46→ path: /

2:36

Overlay

App Domain

API Domain

**stage**

`demo.taskhub-center.net`

`api.demo.taskhub-center.net`

**staging**

`staging.taskhub-center.net`

`api.staging.taskhub-center.net`

So **stage** is the "demo" environment and **staging** is the actual staging environment.

3:10

So the archive\_lapsed\_memberships cronjob runs in prod but not on demo correct? How can I add it?

3:14

Correct — it only runs in prod. Let me check how cronjobs are set up in the stage overlay.

[Skip tool calls ↓](#cc-claude-1-44) [Skip to agent conclusions ↓](#cc-conclusion-1)

3:15 bash

```
{"command":"ls /home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/cronjobs/","description":"List stage cronjobs directory"}
```

3:16 bash

```
{"command":"ls /home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/prod/cronjobs/ 2>/dev/null || echo \"no cronjobs subdirectory in prod\"","description":"Check if prod has cronjobs subdirectory"}
```

3:17

attach\_match\_terms.yaml  
staff\_movement\_index.yaml  
resend\_verification.yaml  
manifest.yaml  
view\_refreshers.yaml  
link\_scan.yaml  
build\_summary\_refresh.yaml  
taskhub\_db\_backup.yaml

3:17

no cronjobs subdirectory in prod

3:47 read

```
{"path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/cronjobs/manifest.yaml"}
```

3:47

10→apiVersion: kustomize.config.k8s.io/v1beta1  
11→kind: Kustomization  
12→# metadata:  
13→# name: taskhub-core--cronjobs  
14→resources:  
15→- attach\_match\_terms.yaml  
16→# - scrapers.yaml  
17→- build\_summary\_refresh.yaml  
18→- resend\_verification.yaml  
19→- view\_refreshers.yaml  
20→- link\_scan.yaml  
21→- taskhub\_db\_backup.yaml  
22→- staff\_movement\_index.yaml

3:50

Let me grab an existing cronjob from stage as a template.

[Skip tool calls ↓](#cc-claude-1-47) [Skip to agent conclusions ↓](#cc-conclusion-1)

3:50 read

```
{"path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/cronjobs/resend_verification.yaml"}
```

3:50

10→apiVersion: batch/v1  
11→kind: CronJob  
12→metadata:  
13→ name: resend-verification-mails-demo  
14→ # namespace: default  
15→spec:  
16→ suspend: false  
17→ schedule: "15 1 \*"  
18→ concurrencyPolicy: Forbid  
19→ jobTemplate:  
20→ spec:  
21→ template:  
22→ spec:  
23→ containers:  
24→ - name: resend-verification-mails  
25→ image: northstarlabs/taskhub:demo  
26→ imagePullPolicy: Always  
27→ command:  
28→ - bundle  
29→ - exec  
30→ - bin/rails  
31→ - runner  
32→ - "ResendVerificationMessageJob.perform\_later"  
33→ envFrom:  
34→ - configMapRef:  
35→ name: env  
36→ env:  
37→ - name: APP\_SECRET\_BASE  
38→ valueFrom:  
39→ secretKeyRef:  
40→ name: app-secrets  
41→ key: app\_secret\_base  
42→ - name: APP\_MASTER\_KEY  
43→ valueFrom:  
44→ secretKeyRef:  
45→ name: app-key  
46→ key: demo.key  
47→ - name: PRIMARY\_DB\_URL  
48→ valueFrom:  
49→ secretKeyRef:  
50→ name: sql-url  
51→ key: primary\_url  
52→ optional: false  
53→ restartPolicy: OnFailure  
54→ imagePullSecrets:  
55→ - name: registry-auth  
56→

3:54

Now let me check how the prod version looks for the env vars.

[Skip tool calls ↓](#cc-claude-1-50) [Skip to agent conclusions ↓](#cc-conclusion-1)

3:54 read

```
{"path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/prod/timers.yaml"}
```

3:54

411→---  
412→apiVersion: batch/v1  
413→kind: CronJob  
414→metadata:  
415→ name: archive-lapsed-membership  
416→spec:  
417→ suspend: False # Enable when prod  
418→ schedule: "30 11 \*"  
419→ jobTemplate:  
420→ spec:  
421→ template:  
422→ spec:  
423→ containers:  
424→ - name: archive-lapsed-membership  
425→ image: northstarlabs/taskhub:stable  
426→ imagePullPolicy: Always  
427→ command:  
428→ - bundle  
429→ - exec  
430→ - rake  
431→ - taskhub:archive\_lapsed\_memberships  
432→ envFrom:  
433→ - configMapRef:  
434→ name: env  
435→ env:  
436→ - name: APP\_MASTER\_KEY  
437→ valueFrom:  
438→ secretKeyRef:  
439→ name: app-key  
440→ key: prod.key  
441→ optional: false  
442→ - name: APP\_SECRET\_BASE  
443→ valueFrom:  
444→ secretKeyRef:  
445→ name: app-secrets  
446→ key: app\_secret\_base  
447→ optional: false  
448→ - name: PRIMARY\_DB\_URL  
449→ valueFrom:  
450→ secretKeyRef:  
451→ name: sql-url  
452→ key: primary\_url  
453→ optional: false  
454→ restartPolicy: OnFailure  
455→ imagePullSecrets:  
456→ - name: registry-auth  
457→  
458→---  
459→apiVersion: batch/v1  
460→kind: CronJob

3:58

You need two changes:

1.  Create the cronjob YAML file
2.  Add it to the kustomization

[Skip tool calls ↓](#cc-conclusion-1) [Skip to agent conclusions ↓](#cc-conclusion-1)

4:01 write

```
{"file_path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/cronjobs/archive_lapsed_memberships.yaml","content":"apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: archive-lapsed-membership\nspec:\n  suspend: false\n  schedule: \"30 11 * * *\"\n  concurrencyPolicy: Forbid\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          containers:\n            - name: archive-lapsed-membership\n              image: northstarlabs/taskhub:demo\n              imagePullPolicy: Always\n              command:\n                - bundle\n                - exec\n                - rake\n                - taskhub:archive_lapsed_memberships\n              envFrom:\n                - configMapRef:\n                    name: env\n              env:\n                - name: APP_MASTER_KEY\n                  valueFrom:\n                    secretKeyRef:\n                      name: app-key\n                      key: demo.key\n                      optional: false\n                - name: APP_SECRET_BASE\n                  valueFrom:\n                    secretKeyRef:\n                      name: app-secrets\n                      key: app_secret_base\n                      optional: false\n                - name: PRIMARY_DB_URL\n                  valueFrom:\n                    secretKeyRef:\n                      name: sql-url\n                      key: primary_url\n                      optional: false\n          restartPolicy: OnFailure\n          imagePullSecrets:\n            - name: registry-auth\n"}
```

4:17

File created successfully at: /home/devnode/dev\_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/cronjobs/archive\_lapsed\_memberships.yaml

4:21 edit

```
{"replace_all":false,"file_path":"/home/devnode/dev_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/cronjobs/manifest.yaml","old_string":"- staff_movement_index.yaml","new_string":"- staff_movement_index.yaml\n- archive_lapsed_memberships.yaml"}
```

4:27

The file /home/devnode/dev\_workspace/aurora/opslane/gitops/taskhub-core/overlays/stage/cronjobs/manifest.yaml has been updated successfully.

4:32

Done. I created archive\_lapsed\_memberships.yaml and added it to the manifest.yaml.

Key differences from the prod version:

*   Uses image `northstarlabs/taskhub:demo` (instead of `:stable`)
*   References `demo.key` for `APP_MASTER_KEY` (instead of `prod.key`)
*   Adds `concurrencyPolicy: Forbid` (matching the stage convention)

## The change

The fix was two files:

1.  Add `gitops/taskhub-core/overlays/stage/cronjobs/archive_lapsed_memberships.yaml`
2.  Add that file to `gitops/taskhub-core/overlays/stage/cronjobs/manifest.yaml`

The demo CronJob used the demo image and demo secret:

*   `northstarlabs/taskhub:demo` instead of `northstarlabs/taskhub:stable`
*   `demo.key` instead of `prod.key`
*   `concurrencyPolicy: Forbid`, matching the existing stage CronJob convention

In the end I was able to commit the infrastructure-as-code changes and run the same expiration task on demo that production already had.

## What I still had to review

I did not blindly commit the generated YAML.

The agent helped identify the shape of the change, but I still had to check:

*   whether `stage` was really the demo environment
*   whether the image tag matched the environment
*   whether the secret keys were environment-specific
*   whether the CronJob belonged in the stage `cronjobs/manifest.yaml`
*   whether the schedule made sense for testing

The agent reduced the search space. It did not remove the need to understand what I was changing.

## Why this worked

This worked because infrastructure-as-code is still code. The answer was already encoded in file paths, YAML manifests, overlay names, image tags, secret keys, and existing CronJob conventions.

The agent was useful at four things:

1.  finding where a concept was defined
2.  comparing environment overlays
3.  spotting repo conventions from nearby files
4.  turning those conventions into a small patch

That is a good fit for an agent. It is not Kubernetes magic. It is repository navigation plus pattern matching, with a human checking the assumptions.

This conversation happened inside the infrastructure-as-code repository. If you do not have the repo checked out, you can still get a weaker first pass by giving the agent a `repomix` file of the infrastructure-as-code repo. The workflow is better when the agent can inspect the actual files.

There was another time when I asked the agent to investigate an environment variable used to connect to a Google Drive folder that failed to operate on demo. The agent pointed me to the problem: a typo in the Drive URL caused the feature to fail on demo.

## Documenting infrastructure

The same workflow applies beyond one CronJob.

Once the agent had proven useful for a narrow operational question, I used it for a broader one: what is even in this infrastructure repo?

I asked the agent to create an architecture diagram of the infrastructure-as-code repo, then used the response to create a Mermaid chart.

![Architecture diagram generated from the infrastructure-as-code repository](/blog/k8s-ai-agent/mermaid_chart.avif)

Here is the prompt I used. I explicitly asked for all the application names and moving parts I knew about:

0:00

I need to create a comprehensive architecture diagram. Please explore the repository to map out ALL the applications, infrastructure components, and their dependencies/connections.

Specifically, I need to understand:

1.  **All Applications and their components:**
    *   AppA (main app, workers, API gateway)
    *   AppB (backend, celery workers, beat)
    *   AppC
    *   AppD
    *   AppE (workers, flower)
    *   AppF
    *   Any other apps

2.  **Databases - which app uses which database:**
    *   Look at database connection strings, secrets, environment variables
    *   Map PostgreSQL clusters to their consuming applications

3.  **Message brokers:**
    *   RabbitMQ - which apps use it
    *   Redis - which apps use it (for caching, sessions, or as broker)

4.  **External services:**
    *   S3/Linode storage
    *   Google Sheets integrations
    *   Slack webhooks
    *   Sentry
    *   New Relic
    *   Any APIs

5.  **Internal service communication:**
    *   Which services talk to each other
    *   API gateway routing
    *   Internal service URLs

6.  **Infrastructure components:**
    *   Ingress/load balancers
    *   Cert-manager
    *   ArgoCD
    *   OpenSearch/logging
    *   Monitoring (Prometheus, Grafana)

Look at:

*   gitops/\*/base and overlays for deployments and secrets
*   kubernetes/ manifests
*   helm/ values files
*   argocd/ application definitions

Provide detailed findings about all connections and dependencies.

## Closing

Agents are useful in infrastructure-as-code repos when the answer is already somewhere in the repo, but the repo is too undocumented or sprawling to navigate quickly.

They help with search, comparison, and pattern extraction. They can tell you that `stage` maps to the demo domain, that production has a CronJob missing from demo, and that stage CronJobs use a different image tag and secret key.

They cannot know whether your team intended the job to run on demo. They cannot know whether `stage` and `staging` should both exist. They cannot replace reviewing the patch.

For me, that is still useful. The agent turned an undocumented Kubernetes question into a small infrastructure-as-code change I could review.
