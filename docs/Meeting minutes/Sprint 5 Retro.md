# Spring Retro - Sprint 5

## Time - Date

2 Apr, 2026

## Location

The Hive, Building 108, ANU

## Participants

Ricky Chen, Jingwen Zhang, Yu Pan, Jiaxin Li, Shuo Li, Aria Fung, Zhimeng Zhu

## Sprint Goal

**Sprint Goal:** Transition from a local prototype to a fully deployed production environment, integrating automated stakeholder workflows and AI-powered analytical tools.

**Status:** Completed

## Follow-up from Previous Sprint

| ID | Inferred Improvement                                               | Status      |
| -- | ------------------------------------------------------------------ | ----------- |
| 1  | Successfully containerized the Spring Boot backend and PostgreSQL database using Docker Compose. The environment is now stabilized on the production server. | Resolved |
| 2  | Conducted a UI/UX audit to fix button regressions and layout shifts.              | In progress |
| 3  | Ollama integration to Gemini and Claude APIs for online usability                 | Resolved |



## What went well

| ID | Item                                                                                |
| -- | ----------------------------------------------------------------------------------- |
| 1  | Successfully containerized and deployed the Spring Boot backend and database, achieving a stable environment for the initial prototype. |
| 2  | Fully integrated the AI pipeline, enabling automated sentiment analysis and structured data processing for user submissions.            |
| 3  | Developed and tested a comprehensive reporting module that supports accurate CSV/JSON exports of Profile, How, and Why data.               |
| 4  | Resolved critical JSON deserialization and database constraint errors, ensuring a smoother user journey during stakeholder demonstrations.    |

The team successfully completed most infrastructure-related tasks and demonstrated the working prototype during the tutor and client meetings. The Docker-based deployment environment allowed easier local testing and system startup.

## Challenges

| ID | Challenge                                                                                              |
| -- | ------------------------------------------------------------------------------------------------------ |
| 1  | Implementing the "Issue-to-Notification" pipeline required complex backend trigger logic and secure management of participant email storage.               |
| 2  | Integrating the Ollama (Llama 3.2) model within a limited 3GB environment risks production failure if container networking or memory allocation is misconfigured.                                     |
| 3  | Handling fragmented submission logic and linking "Why/How" responses via submissionId is critical to preventing broken analytics and inaccurate CSV/JSON reports. |

During the sprint, the team encountered minor integration issues when connecting services in the Docker environment and configuring runtime settings.

## Improvements
| ID | Description                                                             | Assignee      | Due Date    | Issue |
| -- | ----------------------------------------------------------------------- | ------------- | ----------- | ----- |
| 1  | Continuous deployment handled by Vercel (frontend) and Render (backend) | Jiaxin Li     | Next sprint | #246  |
| 2  | Add “Send Updates” feature to User Management page                      | Jingwen Zhang | Next sprint | #240  |
| 3  | Refine process logic for submission                                     | Aria Fung     | Next sprint | #247  |
| 4  | Add test reports and maintenance manuals                                | Shuo Li / Ricky Chen          | Next sprint |  |
| 5  | Changes to the issue editing/deletion functions and user management logic    | Eric / Zhimeng Zhu      | Next sprint |  |


