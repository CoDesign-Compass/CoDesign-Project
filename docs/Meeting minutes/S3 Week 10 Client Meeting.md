# S3 Week 10 Client Meeting
## Date

9 Oct, 2025

## Loaction
The Hive, Building 108, ANU
## Participants
Ricky Chen, Jingwen Zhang, Yu Pan, Jiaxin Li, Aria Fung, Zhimeng Zhu, Heidi Prowse (client)
## Goals
* Discuss progress on front-end design, specifically the light/dark mode transition and font consistency/readability.
* Gather client feedback on proposed design solutions.
* Confirm next meeting time.

## Discussion Topics
| Time  | Item                  | Presenter     | Notes                                                        |
| ----- | --------------------- | ------------- | ------------------------------------------------------------ |
| 13:30 | Light/Dark Mode Transition | Team & Client     | The logo/header bar appears awkward in light mode. The agreed solution is to keep a black bar (or the dark primary color) across the top header in both light and dark modes to ensure the logo is visible against a consistent background.|
| 13:35 | Front-end readability | Team & Client          | Font change: An accessibility review indicated the current display font is hard to read. Decision: Change the primary display font (especially on the title screen) to Poppins for better readability and to ensure consistency with the rest of the site's text. |
| 13:50 | Back-end Status      | Team          | The team confirmed they were currently focusing on the front-end. The back-end status was not discussed in detail, and the client expressed understanding. |
| 13:55 | Mode Switch Icon Fix | Client | The icon (lightbulb/sun/moon) for the mode switch is too big, which should be refined. |

## Decisions
|Decision|Outcome|
|---|---|
|Light/Dark Mode Header|Implement a fixed black/dark header bar that remains consistent across both light and dark modes to ensure logo visibility.|
|Primary Font Change|Change the display font, especially for the main title, to Poppins for improved accessibility and consistency.|
|Title Visibility Solution|Team will experiment with font colors (black/white) and adding a shadow behind the title text to ensure maximum readability against the background image.|
|Next week's work|The next week will focus on admin pages construction.|

## Action Items
|Action Items|Assignee|Due Date|
|---|---|---|
|Implement fixed black/dark header bar for light/dark mode consistency.|Jingwen Zhang|Week 11|
|Change the main display font to Poppins.|Team member|Week 11|
|Experiment with title text color and shadow to optimize visibility against the background image.|Team|Week 11|
|Admin pages frontend construction|Team|Week 12|


## Client Sign-off (only for client meeting)
| Deliverable Presented | Accepted by Client? | Comments |
|----|----|----|
|Front-end design progress (basic pages, text layout)|Yes|Client approved changes and suggested text readability improvements.|

## Task Allocations
|Task|Assignee|Due Date|Issue|
|---|---|---|---|
|Optimise the user page in accordance with the client's revision requests|Jingwen Zhang|Week 11|#96 #102|
|Admin pages frontend construction|Other team members|Week 12|#91 #109 #97 #112|
