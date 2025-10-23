# S3 Week 12 Client Meeting

## Date
23 Oct, 2025

## Location
The Hive, Building 108, ANU

## Participants
Ricky Chen, Jingwen Zhang, Yu Pan, Jiaxin Li, Aria Fung, Zhimeng Zhu, Heidi Prowse (client)

## Goals
* Present the latest updates for both user-side and admin-side interfaces.
* Gather client feedback on question flow and engagement reporting.
* Identify areas for improvement before the next sprint cycle.

## Discussion Topics
| Time  | Item | Presenter | Notes |
|-------| ----- | ---------- | ------ |
| 13:10 | User-side “Why” Interaction | Team & Client | Client suggested changing the user-side **“Why”** question type to a **prompt-based format**. After each answer, a deeper follow-up question should appear (e.g., “Why does this issue matter to you?”) to encourage more reflective responses. |
| 13:14 | Admin Engagement Report | Team & Client | Client requested that the **admin engagement report** should display where users dropped out during the process and the **percentage of completion** for each user. This helps track engagement and identify improvement areas. |
| 13:23 | Admin Issue Visibility | Team & Client | The client noted that currently, **the admin interface cannot view all submitted issues**. The team will investigate and ensure comprehensive issue visibility for admins. |

## Decisions
| Decision | Outcome |
| -------- | -------- |
| Update “Why” section to prompt-based flow with deeper follow-up questions. | Agreed |
| Modify admin engagement report to include user dropout points and completion percentage. | Agreed |
| Fix admin visibility issue so all user-submitted issues can be viewed. | Agreed |

## Action Items
| Action Items | Assignee | Due Date |
| ------------- | -------- | -------- |
| Implement new prompt-based “Why” question logic with dynamic follow-ups. | Yu Pan, Jiaxin Li | sprint 4 |
| Update admin engagement report to include dropout tracking and completion metrics. | Ricky Chen, Aria Fung | sprint 4 |
| Debug and extend admin issue visibility function. | Jingwen Zhang, Zhimeng Zhu | sprint 4 |

## Client Sign-off (only for client meeting)
| Deliverable Presented | Accepted by Client? | Comments |
| ---- | ---- | ---- |
| User-side “Why” redesign proposal and admin engagement reporting demo | Yes | Client approved updates and emphasized making issue links more traceable and reports more insightful. |

## Task Allocations
| Task | Assignee | Due Date | Issue |
| ---- | -------- |----------|-------|
| Implement prompt-based “Why” question sequence | Yu Pan, Jiaxin Li | sprint 4 | -     |
| Update engagement report with dropout tracking and completion rates | Ricky Chen, Aria Fung | sprint 4 | -     |
| Fix admin issue visibility to show all user-submitted issues | Jingwen Zhang, Zhimeng Zhu | sprint 4 | -     |
