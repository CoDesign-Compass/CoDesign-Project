# CoDesign Compass

# Final Client Delivery Package

------

## Project Information

| Item             | Details                                                      |
| ---------------- | ------------------------------------------------------------ |
| Project Name     | CoDesign Compass                                             |
| Project Type     | Full-Stack Web Application                                   |
| Purpose          | AI-assisted participatory issue analysis and reporting platform |
| Delivery Date    | May 2026                                                     |
| Prepared For     | Client Handover                                              |
| Development Team | Ricky Chen, Jingwen Zhang, Eric Pan, Jiaxin Li, Shuo Li, Aria Fung, Zhimeng Zhu |



------

# 1. Project Overview

## 1.1 Introduction

CoDesign Compass is a full-stack web platform designed to support structured public participation and collaborative issue exploration.

The system enables users to:

-  Explore public or organizational issues 
-  Submit structured “Why” and “How” responses 
-  Participate through guided workflows 
-  Generate AI-assisted insights and reports 
-  Provide anonymous or account-linked feedback 

Administrators can:

-  Create and publish issues 
-  Monitor participation trends 
-  Generate AI summaries 
-  Export reports and analytics 
-  Manage users and engagement campaigns 

The platform combines modern frontend technologies, backend APIs, database management, and AI-assisted processing into a single integrated system.



------

# 2. System Architecture

## 2.1 High-Level Architecture

```
Frontend (React)
        ↓
REST API (Spring Boot)
        ↓
PostgreSQL Database
        ↓
AI Processing Module
```



The system follows a layered architecture to ensure maintainability, scalability, and separation of concerns. 



## 2.2 Technology Stack

| Layer              | Technology                      |
| ------------------ | ------------------------------- |
| Frontend           | React + Vite                    |
| UI/Animation       | Tailwind CSS, Framer Motion     |
| Backend            | Spring Boot (Java)              |
| Database           | PostgreSQL                      |
| ORM                | JPA / Hibernate                 |
| AI Integration     | Ollama / OpenAI-Compatible APIs |
| Charts & Analytics | Recharts / ApexCharts           |
| Deployment         | Render                          |
| Version Control    | GitHub                          |



------

# 3. Delivered Features

## 3.1 User Features

| Feature                | Description                                 |
| ---------------------- | ------------------------------------------- |
| Issue Participation    | Users can access issues through share links |
| Guided Why Workflow    | Structured reasoning questions              |
| Guided How Workflow    | Improvement suggestion workflow             |
| Profile Tags           | Users can select reusable profile tags      |
| Login & Registration   | Optional account creation                   |
| Email & Coupon Support | Incentive distribution after participation  |
| Responsive Interface   | Mobile-friendly UI/UX                       |

------

## 3.2 Administrator Features

| Feature                  | Description                              |
| ------------------------ | ---------------------------------------- |
| Dashboard Analytics      | Metrics and participation trends         |
| Issue Management         | Create, edit, disable, and manage issues |
| AI Summary Generation    | Generate AI-based reports                |
| Word Cloud Visualization | Analyze keyword frequency                |
| User Management          | View and manage participants             |
| Email Campaigns          | Send vouchers and update emails          |
| Data Export              | Export reports and raw data              |

------

# 4. User Workflow

## 4.1 Participation Flow

```
/share/:shareId
    ↓
Welcome Page
    ↓
Profile Page
    ↓
Why Questions
    ↓
How Questions
    ↓
Thank You Page
    ↓
(Optional) Login / Register
```



------

## 4.2 Data Flow

```
User opens share link
    ↓
Issue fetched from backend
    ↓
Submission created
    ↓
Profile information saved
    ↓
Why responses saved
    ↓
How responses saved
    ↓
AI processing endpoint triggered
```



------

# 5. Backend & API Overview

## 5.1 Backend Architecture

```
Controller → Service → Repository → Database
```



------

## 5.2 Main Backend Controllers

| Controller                 | Responsibility                           |
| -------------------------- | ---------------------------------------- |
| IssueController            | Issue lifecycle management               |
| WhyResponseController      | Why-response submission                  |
| HowResponseController      | How-response submission                  |
| ProfileController          | User profiles and tags                   |
| AIDataProcessingController | AI data processing and report generation |



------

## 5.3 Key API Endpoints

| Method | Endpoint                      | Purpose              |
| ------ | ----------------------------- | -------------------- |
| POST   | `/api/issues`                 | Create issue         |
| GET    | `/api/issues`                 | Retrieve all issues  |
| GET    | `/api/share/{shareId}`        | Public issue access  |
| POST   | `/api/why`                    | Submit why responses |
| POST   | `/api/how`                    | Submit how responses |
| GET    | `/api/profile/{submissionId}` | Retrieve profile     |
| POST   | `/api/profile/{submissionId}` | Save profile         |
| GET    | `/api/ai-data/{shareId}`      | Generate AI data     |



------

# 6. AI Processing Module

## 6.1 AI Features

The platform includes AI-assisted processing for:

-  Aggregated summaries 
-  Insight generation 
-  Word cloud support 
-  Data cleaning and normalization 
-  Structured report generation 

------

## 6.2 AI Data Processing Logic

The AI module:

-  Fetches latest Why/How responses 
-  Cleans invalid inputs 
-  Converts responses into structured QA pairs 
-  Merges responses into analyzable text 



------

# 7. Deployment & Hosting

## 7.1 Selected Deployment Strategy

### Selected Production Deployment:

## Render Production Environment

The production environment has been fully deployed under the client-owned Render account and production domain.

This includes:

| Component   | Hosting Platform     |
| ----------- | -------------------- |
| Frontend    | Render Static Site   |
| Backend API | Render Web Service   |
| Database    | Render PostgreSQL    |
| SSL         | Included             |
| Domain Name | Custom `.au` domain |



------

## 7.2 Why This Deployment Was Selected

The selected deployment strategy provides:

-  Stable infrastructure 
-  Predictable monthly cost 
-  Simplified maintenance 
-  Easier troubleshooting 
-  Better long-term scalability 



------

# 8. Current Production Cost

## 8.1 Monthly Cost

| Service             |  Cost |
| ------------------- | -------------- |
| Backend Hosting     | ~$7 AUD/month  |
| PostgreSQL Database | ~$0.3 AUD/month  |
| Frontend Hosting    | ~$3 AUD/month       |
| SSL Certificate     | Included       |
| Total               | ~$13.6 AUD/month |



------

## 8.2 Annual Cost

| Service     | Estimated Cost     |
| ----------- | ------------------ |
| Hosting     | ~$163.2 AUD/year     |
| Domain Name | ~$15 AUD/year   |
| Total       | ~$178.2 AUD/year |

Billing and subscription management are fully controlled by the client through the client-owned Render account.
All the cost with a "~" are based on the current plan in May, 2026.



------

## 8.3 Domain

Production domain:


```
codesigncompass.au
```



------

# 9. Testing & Quality Assurance

## 9.1 Testing Scope

The following components were tested:

| Area                | Coverage                      |
| ------------------- | ----------------------------- |
| Backend Services    | API and business logic        |
| AI Module           | AI integration and validation |
| Functional Testing  | User and admin workflows      |
| Integration Testing | Frontend-backend interaction  |



------

## 9.2 Functional Testing Summary

### Administrator Features

| Feature        | Result |
| -------------- | ------ |
| Login          | ✅ Pass |
| Create Issue   | ✅ Pass |
| AI Summary     | ✅ Pass |
| Export Reports | ✅ Pass |
| Email System   | ✅ Pass |

### User Features

| Feature              | Result |
| -------------------- | ------ |
| Guided Question Flow | ✅ Pass |
| “I Don’t Know” Flow  | ✅ Pass |
| Profile Saving       | ✅ Pass |
| Account Registration | ✅ Pass |



------

## 9.3 Reliability & Robustness

Testing confirmed:

-  Stable API behavior 
-  Proper exception handling 
-  AI validation robustness 
-  Graceful failure handling 
-  Consistent data validation 



------

# 10. Maintenance & Support

## 10.1 Running the System Locally

### Backend

```
cd backend
./mvnw spring-boot:run
```



### Frontend

```
cd frontend
npm install
npm start
```



### Docker

```
docker-compose up --build
```



------

## 10.2 Environment Variables

Example:

```
REACT_APP_API_BASE_URL=http://localhost:8080/api
```



Production:

```
REACT_APP_API_BASE_URL=https://codesigncompass.au/api
```





------

## 10.3 Troubleshooting

| Issue                        | Suggested Fix                |
| ---------------------------- | ---------------------------- |
| Frontend showing old version | Clear browser cache          |
| API unavailable              | Check Render deployment      |
| Profile save error           | Verify backend configuration |
| Deployment inconsistency     | Verify environment variables |



------

# 11. Known Limitations

Despite successful testing and deployment, several limitations remain:

| Limitation                  | Description                          |
| --------------------------- | ------------------------------------ |
| AI Variability              | Real-world AI output may differ      |
| No Large-Scale Load Testing | High concurrency not tested          |
| Partial Mock Data           | Some reports may still use mock data |
| Frontend Automated Testing  | Primarily manual testing             |



------

# 12. Future Improvements

Recommended future enhancements include:

-  End-to-end automated testing 
-  Improved AI report generation 
-  Advanced analytics dashboards 
-  Load and performance testing 
-  Enhanced reporting exports 
-  Improved accessibility support 
-  More advanced user management 



------

# 13. Included Documentation

The following documents are included in the delivery package:

| Document                  | Purpose                    |
| ------------------------- | -------------------------- |
| User Guide                | End-user instructions      |
| Admin User Guide          | Administrator operations   |
| Testing Report            | Quality assurance evidence |
| Maintenance Manual        | Technical maintenance      |
| Deployment Recommendation | Hosting recommendation     |
| Wiki Documentation        | Project knowledge base     |



------

# 14. Ownership & Account Transfer

| Item               | Status                                |
| ------------------ | ------------------------------------- |
| GitHub Repository  | Transferred to client-managed account |
| Render Deployment  | Running under client-owned account    |
| Production Billing | Managed by client                     |
| Production Domain  | `codesigncompass.au`                  |
| SSL Certificate    | Active                                |
| Deployment Access  | Client has full administrative access |


The client now has full ownership and administrative control over the production environment, deployment services, domain management, and operational billing.



------


# 15. Final Recommendation

The current deployment and architecture are considered appropriate for:

-  Small-to-medium scale deployment 
-  Client-facing usage 
-  Educational and organizational participation workflows 
-  AI-assisted collaborative analysis 

The Render-only deployment strategy is recommended for long-term operation due to its balance between:

-  Stability 
-  Cost efficiency 
-  Simplicity 
-  Maintainability 
-  Scalability 



------

# 16. Conclusion

The CoDesign Compass platform has been successfully developed, tested, and prepared for deployment.

The final system includes:

-  Full-stack web infrastructure 
-  AI-assisted analysis workflows 
-  User and administrator interfaces 
-  Reporting and export capabilities 
-  Deployment and maintenance documentation 

The system is considered stable and suitable for client delivery and future expansion.

The production deployment, billing setup, and operational ownership have been successfully transferred to the client environment.



------

# Appendix

## Production Website

```
https://codesigncompass.au
```



## Production API

```
https://codesign-project.onrender.com/api
```



------

## Production Domain

```
codesigncompass.au
```



------

## Repository & Source Control

```
GitHub Repository (client-owned & team managed)
```