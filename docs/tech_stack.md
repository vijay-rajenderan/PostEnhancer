# Tech Stack: LinkedIn Post Enhancer (MVP)

This document outlines the architecture and technology choices for the LinkedIn Post Enhancer, prioritizing **speed to market**, **premium aesthetics**, and **extensibility** for future phases.

## Frontend: The "Mirror" UI
*   **Framework**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
    - *Why*: Vite provides lightning-fast HMR (Hot Module Replacement), which is essential for rapid iteration on the UI/UX.
*   **Styling**: **Vanilla CSS / CSS Modules**
    - *Why*: To perfectly mimic the LinkedIn "Card" feel (specific shadows, borders, and Inter typography) without the overhead of external UI frameworks.
*   **State Management**: **React Hooks** (`useState`, `useEffect`)
    - *Why*: Keeps the MVP lightweight and easy to maintain.
*   **Icons**: [Lucide React](https://lucide.dev/)
    - *Why*: Provides high-quality, lightweight icons for a premium feel.

## Infrastructure & Containerization
*   **Containerization**: **Docker** & **Docker Compose**
    - *Why*: Ensures a consistent development environment across different machines. Simplifies running both the React frontend and Express backend with a single command.
*   **Local Development**: `docker-compose up` will spin up the entire stack (Frontend, Backend).

## Backend: The "Opinionated" Engine
*   **Server**: **Node.js** with **Express**
    - *Why*: Standard, robust choice for building lightweight APIs with a massive ecosystem.
*   **LLM Integration**: **Google Gemini 1.5 Flash** (via `@google/generative-ai`)
    - *Why*: Gemini 1.5 Flash provides industry-leading speed (crucial for user experience) and a massive context window for future features like personality mimicry. It also offers a generous free tier for MVP testing.
*   **Authentication**: **None (MVP)**
    - *Why*: To maximize speed to market and focus purely on the content transformation loop.
*   **Security**: [CORS](https://www.npmjs.com/package/cors) & [Dotenv](https://www.npmjs.com/package/dotenv)

## Deployment & Infrastructure
*   **Frontend Hosting**: [Vercel](https://vercel.com/)
    - *Why*: Best-in-class support for React/Vite with automatic SSL and preview deployments.
*   **Backend Hosting**: [Render](https://render.com/) or [Vercel Functions](https://vercel.com/docs/functions)
    - *Why*: Simplifies the deployment of Node.js services and scales easily.

## Strategic Architecture for Phases 2 & 3
1.  **Stateless API**: The backend is built as a single `POST /enhance` endpoint, making it ready for a Chrome Extension or mobile app in Phase 3.
2.  **Prompt Templating**: Prompts are separated from logic to allow for "Style Toggles" (e.g., Contrarian vs. Mentor) in Phase 2.
3.  **No-DB MVP**: To hit the market faster, the MVP will not require a database, focusing purely on the input-output transformation loop.
