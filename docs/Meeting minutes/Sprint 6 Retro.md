# Sprint Retro - Sprint 6

## Time - Date

07 May, 2026

## Location

The Hive, Building 108, ANU

## Participants

Ricky Chen, Jingwen Zhang, Yu Pan, Jiaxin Li, Shuo Li, Aria Fung, Zhimeng Zhu

## Sprint Goal

**Sprint Goal:** Deploy the production-ready system to the online environment, configure automated email workflows, improve testing coverage, refine UI/UX quality based on stakeholder feedback, and prepare final delivery materials.

**Status:** Completed

## Follow-up from Previous Sprint

| ID | Inferred Improvement                                               | Status      |
| -- | ------------------------------------------------------------------ | ----------- |
| 1  | Continuous deployment and production deployment preparation using Render. | Resolved |
| 2  | Improve UI professionalism and interaction consistency across the website. | In Progress |
| 3  | Configure and fix the online automatic email sending functionality. | Resolved |
| 4  | Add workflow testing and improve automated testing coverage. | In Progress |
| 5  | Prepare deployment documentation, manuals, and delivery materials. | In Progress |

## What went well

| ID | Item                                                                                |
| -- | ----------------------------------------------------------------------------------- |
| 1  | Successfully deployed the frontend, backend, and related services to the Render production environment. |
| 2  | Fixed and configured the SMTP-based automatic email sending feature for the online environment. |
| 3  | Added the forgot password functionality and verified the related email recovery workflow. |
| 4  | Improved the overall UI/UX quality based on tutor and client feedback, making the system appear more professional and user-friendly. |
| 5  | Expanded workflow testing and began preparing end-to-end testing for important user flows. |
| 6  | Confirmed deployment strategy and hosting recommendations with the client, including preparation for custom domain connection and DNS configuration. |
| 7  | Coordinated poster preparation, user manuals, deployment documentation, and final delivery materials for project handover. |

The team successfully completed the major deployment and production configuration tasks during the sprint. Communication between the tutor, client, and development team helped ensure that deployment, testing, email services, and UI improvements aligned with stakeholder expectations.

## Challenges

| ID | Challenge                                                                                              |
| -- | ------------------------------------------------------------------------------------------------------ |
| 1  | Configuring SMTP email services in the online production environment required additional environment variable management and platform-specific setup. |
| 2  | Production deployment introduced several environment-related issues, including deployment configuration consistency and service startup validation. |
| 3  | Workflow testing and end-to-end testing required additional planning because many system features depend on integrated frontend-backend interactions. |
| 4  | Coordinating deployment tasks, documentation updates, UI refinements, poster preparation, and final delivery simultaneously increased workload during the sprint. |
| 5  | The custom domain and DNS configuration depended on the client completing the domain purchase and handover process. |

During the sprint, the team identified that production deployment and online environment configuration required significantly more troubleshooting and testing effort compared to local development.

## Improvements

| ID | Description                                                             | Assignee      | Due Date    | Issue |
| -- | ----------------------------------------------------------------------- | ------------- | ----------- | ----- |
| 1  | Continue monitoring production deployment stability and server performance after project handover. | Jiaxin Li | Post-delivery | #286 |
| 2  | Monitor SMTP email delivery reliability and maintain password recovery workflows in production. | Jingwen Zhang | Post-delivery | #291 / #292 |
| 3  | Maintain custom domain and DNS configuration to ensure long-term frontend/backend accessibility. | Jiaxin Li / Eric | Post-delivery | #287 |
| 4  | Collect user feedback after deployment and continue refining UI/UX usability where necessary. | Zhimeng Zhu / Aria Fung | Future maintenance | |
| 5  | Expand automated and end-to-end testing coverage for future maintainability and regression prevention. | Shuo Li | Future maintenance | |
| 6  | Archive and finalize technical documentation, deployment manuals, and project delivery materials. | Ricky Chen | Project closure | |
