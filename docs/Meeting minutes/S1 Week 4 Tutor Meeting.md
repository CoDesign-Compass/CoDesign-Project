# S1 Week 4 Tutor Meeting

## Date

19/03/2026, 10:30am-11:45am

## Loaction

The Hive, Building 108, ANU

## Participants

Ricky Chen, Jingwen Zhang, Yu Pan, Jiaxin Li, Shuo Li, Aria Fung, Zhimeng Zhu, Buddhi Kothalawala(tutor)

## Goals

- Demonstrate current project progress and the live website demo.
- Discuss the core development tasks for the current Sprint: AI integration, deployment, and new features.
- Resolve technical issues regarding code merging and environment sync.
- Receive feedback on moving from a CR to a High Distinction (HD) grade.

## Discussion Topics

| Time | Item | Presenter | Notes |
| :--- | :--- | :--- | :--- |
| 10:30 | **Project Demo & Debugging** | Team | Showcased the current UI. Discussed a bug where buttons disappeared after merging code this week (suspected as a CSS conflict or environment config issue). |
| 10:55 | **New Feature: Email & Coupons** | Aria | Discussed new requirements from the Client: automatic email notifications when new issues are published, including a coupon delivery system. |
| 11:05 | **AI Integration (Ollama)** | Team | Confirmed using the **Ollama** platform to run the **Llama 3.2** model locally (~3GB). AI will analyze user responses to "Why" and "How" questions. |
| 11:15 | **Infrastructure & Hosting** | Team | Reviewed deployment architecture: Frontend and Database on **Netlify**, Backend on **Render**. Currently, AI modules are running in local Docker containers. |
| 11:20 | **Tutor Feedback & Evaluation** | Tutor | Tutor noted current progress is at a close D level. To reach **HD**, the team must excel in AI integration, volunteer feedback collection, and seamless public deployment. |

## Decisions

| Decision | Outcome |
| :--- | :--- |
| **AI Model Selection** | Use **Llama 3.2** via Ollama in local Docker environment to balance performance and deployment costs. |
| **UX Logic Update** | Update survey logic based on the **Ladder of Abstraction**: Users first select a stance (Agree/Disagree), followed by AI-guided probing questions. |
| **Hosting Strategy** | Continue with Render (Backend) + Netlify (Frontend) free tiers. Request resources from the Client/Tutor if deployment limits are reached. |

## Action Items

| Action Items                                          | Assignee | Due Date                  |
| ----------------------------------------------------- | -------- | ------------------------- |
| **Fix Frontend Bugs** (Button visibility/Layout)      | Team     | Next Team Meeting         |
| **Integrate Ollama into Backend**                     | Team     | End of this Sprint        |
| **Complete Public URL Deployment**                    | Team     | Before next Client Meeting|
| **Collect Volunteer Feedback** (User Testing)         | Team     | This weekend              |
| **Send Progress Update Email to Client**              | Jingwen  | Today                     |



## Task Allocations

To be discussed in the team meeting
