# S1 Week 3 Tutor Meeting

## Date

12/03/2026, 10:30am-11:30am

## Loaction

The Hive, Building 108, ANU

## Participants

Ricky Chen, Jingwen Zhang, Yu Pan, Jiaxin Li, Shuo Li, Aria Fung, Zhimeng Zhu, Buddhi Kothalawala(tutor)

## Goals

- Demonstrate the current progress of the project to the tutor
- Explain individual team member contributions
- Receive feedback on system implementation and design
- Identify improvements required before the final presentation
- Discuss next development steps and integration tasks

## Discussion Topics

| Time  | Item                                                         | Presenter | Notes                                                        |
| ----- | ------------------------------------------------------------ | --------- | ------------------------------------------------------------ |
| 10:30 | Project demonstration                                        | Team      | Demonstrated the questionnaire system including issue creation, submission, and dashboard analytics. |
| 10:55 | Core system features (Issue management, questionnaire & submission) | Team      | Demonstrated how issues are created and published, and how questionnaires are linked through share IDs. Users can access surveys via generated links and submit responses. The backend stores anonymous responses and supports session handling and email submission through API. |
| 11:05 | Data analytics and dashboard                                 | Team      | Presented the dashboard displaying response statistics including number of respondents, completion rates, and distribution of options. Charts dynamically retrieve and update data from the backend database. |
| 11:15 | System architecture and infrastructure                       | Team      | Explained the system architecture including backend security, database schema design, and deployment setup. The backend includes authentication, authorization and global error handling. Deployment uses Docker Compose with PostgreSQL database and backend services. |
| 11:20 | Tutor feedback and project evaluation                        | Tutor     | Tutor acknowledged strong progress since the previous meeting and highlighted improvements needed for UX, deployment, integration, and presentation. |

## Decisions

| Decision                         | Outcome                                                      |
| -------------------------------- | ------------------------------------------------------------ |
| Improve system deployment        | Integrate frontend, backend, and database into a single deployed environment accessible via one URL. |
| Improve UX design                | Adjust UI colours and readability, and enhance user interaction and usability. |
| Improve error handling           | Replace browser default alerts with custom popup messages and better error feedback. |
| Highlight project selling points | Focus on unique features such as Ladder API questioning logic, analytics dashboard, and deployment architecture in final presentation. |
| Client engagement                | Demonstrate updated system to client and collect feedback for the next sprint improvements. |

## Action Items

| Action Items                                          | Assignee | Due Date                  |
| ----------------------------------------------------- | -------- | ------------------------- |
| Improve UX design and UI readability                  | Team     | Next sprint               |
| Integrate frontend, backend, and database services    | Team     | Next sprint               |
| Implement custom error handling components            | Team     | Next sprint               |
| Refine analytics and dashboard visualisation          | Team     | Next sprint               |
| Prepare project selling points for final presentation | Team     | Before final presentation |



## Task Allocations

To be discussed in the team meeting
