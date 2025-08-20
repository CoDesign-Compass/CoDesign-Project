# Function Feasibility Investigation

The **CoDesignCompass** project proposes a set of core functions designed to empower individuals with lived experience to contribute meaningfully to policy and service design. These functions range from providing secure and anonymous web access to enabling advanced real-time analytics for administrators. In order to determine whether these features can be realistically implemented, this section evaluates both the **technical feasibility** (i.e., whether the functions can be developed with current tools and technologies) and the **practical feasibility** (i.e., whether they can be effectively adopted and used by target users, including non-technical participants).  

Overall, the analysis indicates that while several features are highly feasible and can be implemented using existing technologies, others involve moderate technical complexity and may require phased implementation to ensure stability and user acceptance.

---

## 1. Secure Web Access (No Login, Privacy-Compliant)
- **Feasibility**: **High**  
  Secure, anonymous access can be achieved using existing web development practices such as HTTPS/TLS encryption, tokenised session links, and secure hosting environments. Platforms like Typeform and Mentimeter already demonstrate the viability of anonymous, no-login participation at scale.  
- **Practical Considerations**: Compliance with Australian privacy regulations (e.g., the Privacy Act 1988) and adherence to research ethics standards are non-negotiable. Additionally, since many participants may be older adults or time-constrained carers, the platform must be lightweight, mobile-responsive, and accessible across devices. Support for accessibility standards (e.g., WCAG 2.1) will further improve usability.

---

## 2. Profile Builder (Demographic and Identity Tags)
- **Feasibility**: **High**  
  Collecting metadata through demographic forms is technically straightforward. Data can be stored in anonymised or pseudonymised formats to protect privacy. Optional demographic tags can provide valuable insights for identifying underrepresented groups without compromising anonymity.  
- **Practical Considerations**: A balance must be struck between collecting sufficiently detailed information for meaningful analysis and ensuring participants do not feel overburdened or exposed. By making all profile fields optional, the platform can respect the preferences of privacy-conscious users while still generating valuable aggregate data.

---

## 3. Why–How Exploration (Guided Reflection)
- **Feasibility**: **Medium–High**  
  Structured reflection tools, such as guided branching questionnaires, can be implemented using standard survey engines or custom-built logic flows. This functionality does not require advanced technology but does require thoughtful design to ensure engagement and avoid repetitive or overly complex question paths.  
- **Practical Considerations**: Participants such as Sophie (a busy carer) will need the process to be concise and meaningful. Adaptive guidance can make the experience more personalised, but overreliance on NLP-based prompts may increase technical risks. A hybrid approach—using static question templates with limited adaptive logic—is both feasible and practical.

---

## 4. Dynamic Questioning Engine (Real-Time Analysis & Adaptation)
- **Feasibility**: **Medium**  
  Real-time clustering of participant input and sentiment analysis can be achieved using open-source NLP libraries (e.g., spaCy, NLTK) or cloud-based services (e.g., Google Cloud Natural Language API). However, developing a fully adaptive questioning engine that updates prompts live based on responses introduces significant technical complexity.  
- **Practical Considerations**: Many participants may be non-technical (like Michael, who is only comfortable with basic iPad use), so the adaptive system must remain simple from their perspective. A phased rollout strategy is recommended: begin with static branching logic, then expand to real-time adaptive features once the platform has matured and a sufficient dataset is available for testing.

---

## 5. Optional Rewards (Separated from Responses)
- **Feasibility**: **High**  
  Handling rewards (e.g., voucher codes, raffles, or gift cards) through a separate process is technically simple. Email addresses or contact details can be stored in a separate secure database that is not linked to anonymous response data. This is a well-established method in research and survey practices.  
- **Practical Considerations**: To maintain participant trust, the system must clearly communicate how reward data is stored and separated from survey responses. Transparency will be crucial to ensuring that privacy-conscious participants feel comfortable opting in.

---

## 6. Admin Dashboard (Analytics & Export)
- **Feasibility**: **Medium–High**  
  Visual analytics such as sentiment maps, word clouds, and demographic charts can be developed using widely available tools (e.g., D3.js for custom data visualisation, Tableau or Power BI for advanced analytics). Open-source dashboards (e.g., Metabase, Grafana) provide additional flexibility.  
- **Practical Considerations**: Since the admin user (Olivia) is technically literate but not a developer, the dashboard must be highly intuitive and require minimal training. Filters, exports, and automated summaries will help reduce the time spent synthesising qualitative data, addressing a major frustration with traditional consultation methods.

---

## Overall Assessment
- **Highly Feasible Functions**:  
  Secure web access, profile builder, and optional rewards. These can be developed using current tools with minimal technical risk and high participant acceptance.  

- **Medium-Risk Functions**:  
  Why–How guided reflection and the admin dashboard are technically achievable but require careful user-centred design to ensure simplicity and avoid participant or admin fatigue.  

- **Challenging Functions**:  
  The dynamic questioning engine introduces the highest complexity. While basic clustering and analysis are feasible, fully adaptive real-time questioning may need iterative development and robust testing before deployment.  

### Recommendation
The most effective approach is to develop a **minimum viable product (MVP)** that prioritises:
1. Secure and anonymous web access,  
2. Basic demographic tagging through the profile builder, and  
3. A simple, easy-to-use admin dashboard.  

Once the MVP is validated with real participants, more advanced features—such as adaptive questioning and sophisticated real-time analytics—can be introduced incrementally. This phased approach minimises risk, ensures stability, and maintains participant trust while gradually enhancing functionality.

---

