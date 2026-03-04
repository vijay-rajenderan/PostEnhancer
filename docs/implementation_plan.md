# Implementation Plan: PostEnhancer (LinkedIn Content Engine)

This plan outlines the step-by-step construction of the LinkedIn Post Enhancer using a React-Node-Gemini-Docker stack, adhering to SOLID, DRY, and centralized logging principles.

## 1. Directory Structure
A clean separation of concerns between frontend and backend.

```text
/class-linkedin
├── client/                 # React (Vite) Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Editor, Preview, Button)
│   │   ├── hooks/          # Custom hooks (e.g., useEnhancer)
│   │   ├── services/       # API calling logic
│   │   └── styles/         # Vanilla CSS modules
│   ├── Dockerfile
│   └── package.json
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic (Gemini API)
│   │   ├── middleware/     # Logging, Request Tracing, Error Handling
│   │   ├── utils/          # Logger (Winston), Constants
│   │   └── routes/         # API Endpoint definitions
│   ├── Dockerfile
│   └── package.json
├── .env                    # GEMINI_API_KEY (Gitignored)
├── docker-compose.yml      # Orchestration
└── README.md
```

---

## 2. Implementation Phases

### Phase 1: Project Scaffolding & Docker
*   **Action**: Initialize root directory, sub-folder structures, and `package.json` files.
*   **Docker**: Create `Dockerfile` for both client and server.
*   **Compose**: Configure `docker-compose.yml` with port 5173 for client and 3000 for server.

### Phase 2: Backend - The "Opinionated" Foundation
*   **Logging & Tracing**: Implement a centralized `logger.ts` using Winston. Create a `tracing.middleware.ts` to attach a `Correlation-ID` to every request.
*   **Gemini Service**: Implement `GeminiService.ts` using the Singleton pattern. 
*   **System Prompting**: Craft the "Opinionated Engineer" system prompt that handles hooks and structure.
*   **Controller**: Create `EnhanceController.ts` following SOLID (handling the request/response logic separately from the AI logic).

### Phase 3: Frontend - The "LinkedIn Mirror"
*   **Layout**: Simple split-pane view (Layout: Top/Bottom for mobile, Left/Right for desktop).
*   **Editor**: A high-performance text area for the raw brain dump.
*   **Preview Component**: A styled component that mimics the LinkedIn post UI (Font: Inter, Light gray borders).
*   **State**: Manage the "dump" and "result" states without complex state libraries.

### Phase 4: Integration & Polish
*   **API Hook**: Create `useEnhancer` hook to handle loading states, error reporting, and board-wide logging of the enhancement process.
*   **Copy-to-Clipboard**: Final utility for the user to grab the content.

### Phase 5: Automatic LinkedIn Posting
*   **LinkedIn Service**: Implement `LinkedInService.js` to handle authenticated POST requests to LinkedIn's API (`/rest/posts`).
*   **LinkedIn Controller**: Create `LinkedInController.js` to handle the post-to-linkedin request from the frontend.
*   **Route Integration**: Add `POST /api/linkedin/post` to `server/src/routes/api.js`.
*   **UI Integration**: Add a "Post to LinkedIn" button to the `Preview` component, with loading states and success/error notifications.
*   **Env Configuration**: Add `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN` placeholders to `.env`.

### Phase 6: Content Quality & UX Refinements (Current)
*   **Content Scoring**: Implemented AI evaluation returning an `engagementScore` (1-10) visualized with dynamic color badges.
*   **Target Length Slider**: Integrated a slider (300-3000 chars) that dynamically updates Gemini's system instructions.
*   **Architect Persona Section**: Added a persona management module in UI to ground the AI in the user's resume/experience.
*   **Icon Enforcement**: Stricter rules for professional emoji usage (max 3, start-of-line placement).
*   **Interactive Editor Area**: Made the preview area editable for final manual polishing.
*   **Markdown/JSON Sanitization**: Configured Gemini for strict `application/json` output to eliminate UI formatting artifacts.
*   **Rich Text Tools**: Implemented Bold/Italic tools using Unicode conversion for LinkedIn feed compatibility.
*   **AI Smart Format**: Added a "Smart Polish" feature using Gemini to automatically apply visual hierarchy to technical terms.

---

## 3. Technical Constraints & Defaults
*   **Backend Port**: `3000` (Strict).
*   **Frontend Port**: `5173` (Strict).
*   **Model**: `gemini-1.5-flash` (Strict JSON Mode).
*   **Logger**: `Winston` with JSON output for Docker compatibility.
*   **LinkedIn API Version**: `202601` (Updated).
*   **Hashtag Policy**: Exactly 5 highly relevant hashtags.
*   **Emoji Policy**: Max 3 professional icons per post.

---

## 4. Verification & Testing Plan

### Automated Checks
*   **Health Check**: Ensure `GET /health` returns 200 with basic system status.

### Manual Verification Flow (Step-by-Step)
1.  **Environment Check**: Verify `.env` contains a valid `GEMINI_API_KEY`.
2.  **Startup**: Run `docker-compose up --build`.
3.  **Port Conflict Test**: Check container logs for port 3000/5173 occupancy errors.
4.  **Transformation Test**:
    *   Input: "I think agents are cool because they do work for me."
    *   Expected: A post starting with an attention-grabbing hook (e.g., "Stop doing manual work. Let agents do it for you."), structured with white space, and 3 hashtags.
5.  **Traceability Test**: Perform one enhancement and check server logs. Ensure the same `Correlation-ID` appears in the "Request Received", "Gemini Called", and "Response Sent" logs.
6.  **Clipboard Test**: Click "Copy" and ensure content pastes correctly into a blank document with all newlines preserved.
