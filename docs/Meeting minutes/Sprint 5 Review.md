# Sprint Review - Sprint 5
## Time - Date

02/04/2026

## Location
The Hive, Building 108, ANU
## Participants
Ricky Chen, Jingwen Zhang, Yu Pan, Jiaxin Li, Shuo Li, Aria Fung, Zhimeng Zhu
## Completed Work
| Feature / Deliverable                             | Status      | Notes                                               |
| ------------------------------------------------- | ----------- | --------------------------------------------------- |
| **Production Server Deployment**                  | Completed | Successfully containerized the Spring Boot backend and PostgreSQL database using Docker Compose on the production server. |
| **AI Integration**                                | Completed | Integrated the claude model to handle automated sentiment analysis for "Why/How" responses . |
| **Multi-Format Data Export System**               | Completed | Developed a robust Reporting Service supporting raw data exports in both CSV and JSON formats for offline research analysis. |
| **UI/UX Consistency Audit**                       | Completed | Standardized button styles, question layouts, and interaction patterns across Why, How, and Dashboard pages based on tutor feedback. |
| **Submission Workflow Refactoring**               | Completed | Resolved data linkage issues by ensuring all responses are consistently mapped via `submissionId`, improving analytics accuracy. |


## Client / Tutor Feedback
*Tutor:*

- The tutor acknowledged the team's technical initiative in transforming the project into a fully functional web portal and significantly exceeding initial goals by evolving the AI pipeline from local Ollama to Gemini, OpenAI, and Claude APIs.
- The tutor suggested that the final sprint should shift focus toward system stability and high-quality UI/UX refinement, specifically prioritizing rigorous automated testing to ensure the reliability of core workflows and AI report generation.

*Client:*

- The client acknowledged the team's professional delivery of the fully functional online portal and expressed high satisfaction with the live demonstration, recorded video guides, and comprehensive user manuals provided. 
- The client suggested that the final phase of testing should involve her own provided datasets to rigorously verify the accuracy and reliability of the AI-generated analysis results. 
- The team committed to supporting this validation process to ensure the automated insights meet the specific research requirements of the stakeholder.

## Adjusted Priorities
| Feature / Deliverable             | Issue | Previous Priority | New Priority | Reason                                                                 |
| :-------------------------------- | :---- | :---------------- | :----------- | :--------------------------------------------------------------------- |
| **Automated CI/CD Pipeline**      | #246  | Medium            | High         | Transitioning to Vercel/Render to ensure continuous production uptime. |
| **User Notification System**      | #240  | Medium            | High         | Implementing "Send Updates" for stakeholder-driven user engagement.    |
| **Submission Logic Refinement**   | #247  | High              | High         | Optimizing "Why/How" process logic to prevent critical data linkage errors. |
| **Technical Documentation**       | N/A   | Low               | Medium       | Developing test reports and manuals for final project handover.        |
| **Admin Control Optimization**    | N/A   | Medium            | Medium       | Refining issue editing and user management logic to improve admin UX.  |
