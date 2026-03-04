# User Stories: LinkedIn Post Enhancer (MVP)

## Vision
To provide users with a "friction-to-flow" experience, turning raw, unorganized thoughts into high-engagement LinkedIn content in seconds.

---

## 1. Core Content Generation
### Story 1: The Raw Brain Dump
**As a** busy professional with a fleeting idea,
**I want to** paste or type a messy "thought dump" into a simple text area,
**So that** I don't have to worry about grammar, structure, or hooks while brainstorming.
*   **Acceptance Criteria:**
    *   Text area supports at least 2000 characters.
    *   Interface is distraction-free.

### Story 2: The Opinionated Transformation
**As a** user who wants to stand out,
**I want** the AI to automatically identify the most provocative part of my text and make it the "Hook",
**So that** I can capture attention in the LinkedIn feed without manual editing.
*   **Acceptance Criteria:**
    *   Output starts with a "scroll-stipping" hook.
    *   The body is broken into 1-2 sentence paragraphs for mobile readability.

### Story 3: Engagement Automation
**As a** creator looking for growth,
**I want** the tool to suggest a specific closing question and 3 relevant hashtags,
**So that** I can maximize comments and reach without extra research.
*   **Acceptance Criteria:**
    *   Generates 1 relevant engagement question at the end.
    *   Provides exactly 3 hashtags.

---

## 2. User Interface & Experience
### Story 4: The LinkedIn Mirror (Preview)
**As a** user,
**I want to** see a live preview of how my post will look on LinkedIn (font, spacing, "See more" cutoff),
**So that** I am confident in the visual presentation before I post.
*   **Acceptance Criteria:**
    *   A preview box styled to look like a LinkedIn post feed item.
    *   Shows where the typical "See more" cutoff would occur.

### Story 5: Instant Portability
**As a** user who is in a hurry,
**I want to** click a single "Copy" button to grab the final formatted text,
**So that** I can immediately paste it into the LinkedIn app/website.
*   **Acceptance Criteria:**
    *   "Copy to Clipboard" button provides visual confirmation (e.g., text changes to "Copied!").
    *   All formatting (newlines) is preserved in the clipboard.

---

## 3. Technical & Performance
### Story 6: Speed to Result
**As a** user,
**I want** the enhancement process to take less than 5 seconds,
**So that** my creative flow isn't interrupted by long loading screens.
*   **Acceptance Criteria:**
    *   Processing time (LLM call + structure) is optimized for speed.
    *   A clean loading state is shown during processing.
