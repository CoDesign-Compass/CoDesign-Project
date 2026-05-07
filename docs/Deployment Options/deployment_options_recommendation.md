# Deployment Options and Cost Comparison

## CoDesign Compass – Hosting & Deployment Recommendation

---

# 1. Purpose of This Document

This document explains the available deployment and hosting options for the CoDesign Compass system.

The purpose is to help the client understand:

- Where the system will be hosted
- How much the deployment may cost
- The advantages and disadvantages of each option
- Which option is recommended for the current project stage
- Additional operational costs such as domain names and database hosting

This comparison focuses on balancing:

| Consideration | Description |
|---|---|
| Cost | Monthly and yearly operational cost |
| Stability | Reliability and uptime |
| Performance | Speed and responsiveness |
| Ease of Maintenance | How easy the system is to manage |
| Scalability | Ability to support more users later |
| Technical Complexity | Difficulty of deployment and maintenance |

---

# 2. System Components That Need Hosting

The CoDesign Compass system contains several parts that must be deployed online.

| Component | Purpose |
|---|---|
| Frontend Website | User interface that participants interact with |
| Backend API Server | Handles business logic and AI processing |
| Database | Stores submissions, profiles, and reports |
| AI Processing Services | Generates summaries and AI-assisted analysis |
| File Storage / Export | Stores generated reports and exports |
| Domain Name | Provides a public website URL |

---

# 3. Current Technical Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Spring Boot (Java) |
| Database | PostgreSQL |
| AI Integration | Ollama / OpenAI-compatible API |
| Deployment | Render / Netlify / Railway |
| Version Control | GitHub |

---

# 4. Estimated System Size and Usage

The current system is designed for a small-to-medium user base.

## Estimated Database Size

| Data Type | Estimated Usage |
|---|---|
| User Profiles | Low |
| Survey / Issue Responses | Medium |
| AI Reports | Medium |
| Logs and Metadata | Low |
| Estimated Initial Database Size | Under 1 GB |

### Expected Growth

| Time Period | Estimated Database Size |
|---|---|
| Initial Deployment | 0.5 – 1 GB |
| After 1 Year | 1 – 5 GB |
| Future Scaling | Can be upgraded if needed |

At the current project stage, a small managed PostgreSQL database is sufficient.

---

# 5. Deployment Options

## Option 1 – Keep the Current Setup

### Overview

Continue using the existing deployment configuration:

- Frontend hosted separately
- Backend hosted separately
- Free or low-cost infrastructure

### Typical Setup

| Component | Platform |
|---|---|
| Frontend | Netlify |
| Backend | Render |
| Database | Render PostgreSQL |

### Estimated Cost

| Service | Estimated Monthly Cost |
|---|---|
| Frontend Hosting | Free |
| Backend Hosting | Free – $7 AUD |
| Database | Free |
| Domain Name | Optional |
| Total | $0 – $7 AUD/month |

### Advantages

- Lowest cost
- Already working
- No migration required
- Easy for students and small teams

### Disadvantages

- Free services may “sleep” after inactivity
- First request may be slower
- Lower long-term reliability

### Technical Notes

| Category | Assessment |
|---|---|
| Stability | Moderate |
| Performance | Acceptable |
| Maintenance | Easy |
| Scalability | Limited |
| Recommended for Production | No |

### Summary

This option is suitable for prototypes and demonstrations, but less suitable for long-term client usage.

---

# 6. Option 2 – Railway Hosting

## Overview

Host the entire application using Railway.

### Typical Setup

| Component | Platform |
|---|---|
| Frontend | Railway |
| Backend | Railway |
| Database | Railway PostgreSQL |

### Estimated Cost

| Service | Estimated Monthly Cost |
|---|---|
| Hosting | $0 – $15 AUD |
| Database | Included / usage-based |
| Domain Name | Extra |
| Total | Approximately $0 – $15 AUD/month |

### Advantages

- Everything managed in one place
- Easy deployment workflow
- Fast performance
- No cold-start delay

### Disadvantages

- Usage-based pricing may increase unexpectedly
- Less predictable monthly billing
- Smaller free-tier limitations

### Technical Notes

| Category | Assessment |
|---|---|
| Stability | Good |
| Performance | Good |
| Maintenance | Easy |
| Scalability | Good |
| Cost Predictability | Medium |

### Summary

Railway provides a simple deployment experience but may become more expensive as usage increases.

---

# 7. Option 3 – Render Only (Recommended)

## Overview

Deploy the entire system using Render.

This means:

- Frontend hosted on Render
- Backend hosted on Render
- PostgreSQL database hosted on Render
- Single deployment platform for the whole system

This is the option selected for the project.

---

## Proposed Architecture

| Component | Deployment Method |
|---|---|
| Frontend | Render Static Site |
| Backend API | Render Web Service |
| Database | Render PostgreSQL |
| AI Service | External API / Local AI Integration |
| Domain Name | Custom .com domain |

---

## Estimated Monthly Cost

| Service | Estimated Cost |
|---|---|
| Frontend Hosting | Free – Included |
| Backend Web Service | ~$7 AUD/month |
| PostgreSQL Database | ~$7 AUD/month |
| Domain Name (.com) | ~$15–16 AUD/year |
| SSL Certificate | Included |
| Total Estimated Monthly Cost | ~$14 AUD/month |

---

## Estimated Annual Cost

| Item | Estimated Yearly Cost |
|---|---|
| Render Hosting | ~$168 AUD/year |
| Domain Name (.com) | ~$15–16 AUD/year |
| Total | ~$183–184 AUD/year |

---

## Recommended Domain Name

A professional `.com` domain is recommended because:

- Most familiar for users
- Easier to remember
- Looks more professional
- Better for future public deployment

### Suggested Domain

| Domain | Estimated Yearly Cost |
|---|---|
| codesigncompass.com | Approximately $15–16 AUD/year |

---

## Advantages

| Benefit | Explanation |
|---|---|
| Stable Hosting | No sleeping/free-tier delay |
| Predictable Cost | Monthly pricing remains stable |
| Simplified Maintenance | One platform for all services |
| Easier Troubleshooting | Centralized logs and deployments |
| Good Client Experience | Faster and more reliable |
| Easy Future Scaling | Services can be upgraded later |

---

## Disadvantages

| Limitation | Explanation |
|---|---|
| Higher Cost | More expensive than fully free hosting |
| Vendor Dependence | System relies mainly on Render |

---

## Technical Assessment

| Category | Assessment |
|---|---|
| Stability | Very Good |
| Performance | Very Good |
| Maintenance | Easy |
| Scalability | Good |
| Cost Predictability | High |
| Recommended for Client Deployment | Yes |

---

## Why This Option Was Selected

The tutor recommended:

- Clearer deployment structure
- More stable infrastructure
- Better explanation of operational costs
- A recommended deployment approach

After comparing all options, Render-only deployment was selected because it provides:

- A balance between cost and reliability
- Simple deployment and maintenance
- Stable performance for client usage
- Lower technical complexity
- Predictable long-term cost

This option is considered the most practical solution for the current project scope.

---

# 8. Option 4 – AWS / Google Cloud Platform

## Overview

Use enterprise cloud providers such as:

- Amazon Web Services (AWS)
- Google Cloud Platform (GCP)

---

## Estimated Cost

| Service | Estimated Monthly Cost |
|---|---|
| Compute Services | $20–60 AUD |
| Managed Database | $10–30 AUD |
| Storage & Networking | Additional |
| Domain Name | Additional |
| Total | ~$20–100+ AUD/month |

---

## Advantages

| Benefit | Explanation |
|---|---|
| Enterprise-Level Infrastructure | Used by large companies |
| High Scalability | Can support large user growth |
| Advanced Services | Many additional cloud features |
| High Reliability | Strong uptime guarantees |

---

## Disadvantages

| Limitation | Explanation |
|---|---|
| Complex Setup | Requires advanced DevOps knowledge |
| Higher Maintenance | More configuration required |
| Expensive | Not suitable for small projects |
| Over-Engineered | Beyond current project requirements |

---

## Technical Assessment

| Category | Assessment |
|---|---|
| Stability | Excellent |
| Performance | Excellent |
| Maintenance | Difficult |
| Scalability | Excellent |
| Cost Predictability | Medium |
| Recommended for Current Project | No |

---

# 9. Overall Comparison

| Option | Estimated Monthly Cost | Ease of Use | Stability | Scalability | Risk Level | Recommended |
|---|---|---|---|---|---|---|
| Current Setup | $0–7 AUD | Very Easy | Moderate | Limited | Low | No |
| Railway | $0–15 AUD | Easy | Good | Good | Medium | Possible |
| Render Only | ~$14 AUD | Easy | Very Good | Good | Low | Yes |
| AWS / GCP | $20–100+ AUD | Difficult | Excellent | Excellent | High | No |

---

# 10. Final Recommendation

## Recommended Deployment Strategy

### Selected Option:
# Option 3 – Render Only

---

## Recommendation Summary

| Reason | Explanation |
|---|---|
| Stable Performance | Reliable hosting without free-tier sleeping |
| Predictable Cost | Approximately $14 AUD/month |
| Easier Maintenance | Single platform for frontend, backend, and database |
| Better Client Experience | Faster loading and more reliable access |
| Appropriate Complexity | Suitable for the current project size |
| Future Scalability | Can upgrade resources later if needed |

---

## Recommended Production Setup

| Component | Recommended Service |
|---|---|
| Frontend | Render Static Site |
| Backend | Render Web Service |
| Database | Render PostgreSQL |
| Domain Name | codesigncompass.com |
| SSL | Included with Render |

---

# 11. Conclusion

The Render-only deployment solution provides the best balance between:

- Cost
- Stability
- Ease of maintenance
- Technical simplicity
- Future scalability

Although it is slightly more expensive than the free deployment setup, it offers a much more professional and reliable experience for client-facing deployment.

For the current stage of the CoDesign Compass project, this option is considered the most suitable long-term deployment strategy.

