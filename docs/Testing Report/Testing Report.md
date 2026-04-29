## **CoDesign Compass System**

### **Testing Report**

------

 **Project:** CoDesign Compass
 **Team Members:** Ricky Chen, Jingwen Zhang, Yu Pan, Jiaxin Li, Shuo Li, Aria Fung, Zhimeng Zhu
 **Date:** April 2026



## 1. Introduction

This report presents the testing process and results for the **CoDesign Compass system**, covering backend services, APIs, and AI modules.

The purpose of testing is to:

-  Verify system functionality 
-  Ensure data consistency 
-  Validate AI integration 
-  Identify and document bugs 

------

## 2. Testing Scope

### Backend Services

-  Issue management 
-  Submission processing 
-  Profile management 
-  Email services 

### API Layer

-  Issue APIs 
-  Submission APIs 
-  User APIs 

### AI Module

-  AI client integrations (OpenAI, Claude, Gemini, Ollama)  
-  AI report generation and validation  

------

## 3. Testing Methodology

-  **Unit Testing** – Service and controller level testing 
-  **Integration Testing** – API interaction testing 
-  **Mock Testing** – AI responses simulated 
-  **Manual Testing** – Frontend interaction 

------

## 4. Test Execution Results

-  All tests executed using VSCode Test Runner 
-  Total test suite passed successfully 
-  No failures or errors 

**Execution Time:** ~7.9 seconds

> All backend automated tests passed successfully, indicating system stability.

------

##  5. Test Cases

###  Core Functional Test Cases

| Test ID | Module    | Test Description                    | Expected Result              | Actual Result | Status |
| ------- | --------- | ----------------------------------- | ---------------------------- | ------------- | ------ |
| TC01    | AI Client | API returns valid response          | Response processed correctly | Success       | ✅ Pass |
| TC02    | AI Client | API returns empty response          | System throws error          | Success       | ✅ Pass |
| TC03    | AI Client | API returns non-2xx                 | Error handled properly       | Success       | ✅ Pass |
| TC04    | AI Report | Missing submissionId                | Validation error             | Success       | ✅ Pass |
| TC05    | AI Report | Invalid shareId                     | Error returned               | Success       | ✅ Pass |
| TC06    | AI Report | Valid submission → report generated | Report created               | Success       | ✅ Pass |
| TC07    | AI Report | Invalid AI output                   | System rejects response      | Success       | ✅ Pass |

### Submission & Data Processing

| Test ID | Module          | Test Description      | Expected Result            | Actual Result | Status |
| ------- | --------------- | --------------------- | -------------------------- | ------------- | ------ |
| TC08    | Submission      | Create submission     | Stored successfully        | Success       | ✅ Pass |
| TC09    | Submission      | Submit twice          | Return existing submission | Success       | ✅ Pass |
| TC10    | Submission      | Missing issue         | Error returned             | Success       | ✅ Pass |
| TC11    | Data Processing | Clean invalid answers | Filtered correctly         | Success       | ✅ Pass |

### User & Email System

| Test ID | Module | Test Description  | Expected Result | Actual Result | Status |
| ------- | ------ | ----------------- | --------------- | ------------- | ------ |
| TC12    | User   | Signup valid user | Account created | Success       | ✅ Pass |
| TC13    | User   | Duplicate email   | Rejected        | Success       | ✅ Pass |
| TC14    | Email  | Send gift email   | Email sent      | Success       | ✅ Pass |
| TC15    | Email  | Missing config    | Error handled   | Success       | ✅ Pass |

### API & Controller

| Test ID | Module | Test Description | Expected Result       | Actual Result | Status |
| ------- | ------ | ---------------- | --------------------- | ------------- | ------ |
| TC16    | API    | Get issue by ID  | Correct data returned | Success       | ✅ Pass |
| TC17    | API    | Delete issue     | Removed successfully  | Success       | ✅ Pass |
| TC18    | API    | Invalid request  | Error returned        | Success       | ✅ Pass |

------

## 6. Test Coverage Analysis

- This project demonstrates **broad and structured test coverage** across multiple system layers:

  ###  6.1 Layer Coverage

  | Layer                | Coverage Description                                         |
  | -------------------- | ------------------------------------------------------------ |
  | Controller Layer     | API endpoints tested for request validation and response correctness |
  | Service Layer        | Business logic tested with edge cases and exception handling |
  | Repository Layer     | Indirectly validated through service-level tests             |
  | AI Integration Layer | External API interactions simulated and validated            |

  ------

  ###  6.2 Functional Coverage

  The test suite covers key system functionalities:

  -  Issue lifecycle management 
  -  Submission workflow and validation 
  -  AI report generation and parsing 
  -  User authentication and email services 
  -  Dashboard analytics and metrics 

  ------

  ###  6.3 Edge Case Coverage

  Special attention was given to edge cases:

  -  Null or missing input 
  -  Invalid identifiers (submissionId / shareId) 
  -  Empty AI responses 
  -  External API failures 
  -  Duplicate data scenarios

------

##  7. System Reliability & Robustness

The testing results indicate that the system demonstrates strong robustness:

-  Graceful handling of invalid inputs 
-  Proper exception handling across all layers 
-  Resilience to external API failures (AI services) 
-  Consistent data validation mechanisms 

Particularly, the AI module ensures:

-  Invalid or malformed AI responses are rejected 
-  JSON parsing is validated before usage 
-  Failures are converted into appropriate HTTP errors

------
  
## 8. Known Issues

### Issue 1: Submission Data Association (Resolved)

-  Description: Why/How responses were not linked to submissionId 
-  Impact: Data inconsistency in AI processing 
-  Resolution: Refactored service layer to ensure submission-based linkage 

------

### Issue 2: Maven Wrapper Configuration

-  Description: Missing `.mvn/wrapper` files 
-  Impact: Cannot run tests via command line 
-  Workaround: Tests executed through IDE 

------
  
## 9. Limitations

Despite comprehensive testing, some limitations remain:

-  AI responses are mocked; real-world outputs may vary 
-  No large-scale performance or load testing conducted 
-  Frontend testing is primarily manual and not automated 

------
  
## 10. Future Testing Improvements

Future improvements may include:

-  End-to-end testing (Frontend + Backend integration) 
-  Performance testing under concurrent users 
-  Real AI response validation using live APIs 
-  Automated UI testing (e.g., Selenium / Cypress) 

------
  
## 11. Conclusion

The CoDesign Compass system has been systematically tested across multiple layers, demonstrating strong functional correctness and system reliability.

Key strengths include:

-  Comprehensive backend test coverage 
-  Robust AI integration handling 
-  Effective validation and error handling mechanisms 

Overall, the system meets the expected requirements and is considered **stable and ready for deployment**, with opportunities for further enhancement in performance and end-to-end testing.