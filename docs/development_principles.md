# Development Principles & Standards: LinkedIn Post Enhancer

This document establishes the architectural standards and engineering principles that will govern the development of the LinkedIn Post Enhancer. These rules prioritize maintainability, observability, and robust software design.

## 1. Core Engineering Principles
To ensure the application is scalable and bug-resistant, we adhere to the following:

*   **SOLID Principles**:
    *   **Single Responsibility**: Each class/module (e.g., GeminiService, PostController) will have one reason to change.
    *   **Open/Closed**: The system should be open for extension (adding new "Styles") but closed for modification of core logic.
    *   **Dependency Inversion**: High-level modules (Controllers) will depend on abstractions (Services), not concrete implementations.
*   **DRY (Don't Repeat Yourself)**: Common logic for string manipulation, error handling, and API responses will be centralized in utility classes.
*   **Design Patterns**: 
    *   **Service Layer Pattern**: Decoupling the business logic (Post Enhancement) from the transport layer (Express routes).
    *   **Singleton Pattern**: Used for the Gemini API client and Logger instances to manage resources efficiently.

## 2. Observability & Logging
Infrastructure without visibility is a liability.
*   **Centralized Logging**: Using `Winston` or `Pino` as the logging framework.
*   **Request Tracing**: 
    *   Every request will be assigned a unique `Correlation-ID`.
    *   This ID will be passed through the Service layer and captured in all log entries to allow end-to-end debugging of a single user action.
*   **Log Levels**: Strict adherence to `INFO`, `WARN`, `ERROR`, and `DEBUG` levels.

## 3. Configuration & Ports
*   **Fixed Ports**: Port numbers are considered immutable in this project to prevent deployment drift.
    *   **Frontend**: `5173` (Vite Default)
    *   **Backend**: `3000` (Express Default)
*   **Conflict Resolution**: If a port is occupied on the local machine, the system will NOT auto-increment. Instead, it will log a critical error and inform the user of the specific conflict.

## 4. Code Reuse & Logic
*   **Existing Logic Priority**: Before writing new helper functions, the codebase will be scanned for existing utilities that satisfy the requirement.
*   **Statelessness**: The MVP will maintain zero state locally, ensuring it can be containerized or moved to serverless environments without refactoring.

## 5. Implementation Strategy
All code changes must include:
1.  **Documentation**: Updated JSDoc/README where applicable.
2.  **Verification**: Explicit instructions on how to test the specific change via a manual or automated flow.
