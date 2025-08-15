### Scenario 1: Publishing a New Core Problem
**Actor:** System Administrator (only one admin account)

**Preconditions:**
* Logged in with admin credentials
* Has a new “core problem” and related “how” issues to publish
* Wants link sharing to be time-limited
* User tag selection capped at 20

**Steps:**
1. Opens admin dashboard and logs in.
2. Navigates to “Create New Issue” section.
3. Enters core problem and pre-fills related “how” issues.
4. Sets “why” question depth to 5, ensuring first “why” has no “I don’t know” option.
5. Configures tag limit to 20 per participant.
6. Generates a shareable link with an expiry date.
7. Publishes the new issue without modifying any existing published ones.

**Postconditions:**
* New issue is live and accepting responses.
* Shareable link will expire at the set date.
* All participant responses remain anonymous unless they consent to email linkage.

### Scenario 2: Reviewing Responses and Distributing Rewards
**Actor:** System Administrator (only one admin account)

**Preconditions:**
* Logged in with admin credentials
* Has at least one closed or active issue with responses
* Some users have consented to link email addresses for rewards

**Steps:**
1. Opens admin dashboard and logs in.
2. Selects an issue to review.
3. Filters responses by tags or profile data.
4. Views basic analytics: top descriptors, word clouds, sentiment maps.
5. Exports all anonymized response data as a CSV file.
6. Identifies participants eligible for rewards.
7. Sends rewards manually to consenting users via their linked email addresses.

**Postconditions:**
* Admin has an exported dataset for further analysis.
* Rewards are distributed to consenting participants.
* Insights inform next steps for engagement or policy adjustments.