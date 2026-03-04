# 🏗️ PostEnhancer: LinkedIn Content Engine

An enterprise-grade, AI-native workspace designed to transform raw technical thoughts into high-authority LinkedIn content. Grounded in your professional persona and optimized for executive-level engagement.

![Tech Stack](https://img.shields.io/badge/Stack-React_|_Node_|_Docker-blue.svg)
![AI Engine](https://img.shields.io/badge/AI-Gemini_1.5_Flash-orange.svg)
![Architecture](https://img.shields.io/badge/Architecture-SOLID_|_Hexagonal-green.svg)
![Formatting](https://img.shields.io/badge/Formatting-Rich_Unicode-blueviolet.svg)

---

## �️ System Architecture

The application implements a decoupled Hexagonal-inspired architecture, ensuring maximum resilience and horizontal scalability.

```mermaid
flowchart TD
    %% Global Styles
    classDef default font-family:Inter,font-size:14px,color:#fff;
    classDef client fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;
    classDef server fill:#0f172a,stroke:#334155,stroke-width:2px,color:#fff;
    classDef ai fill:#f59e0b,stroke:#d97706,stroke-width:3px,color:#fff;
    classDef linkedin fill:#0077b5,stroke:#005a87,stroke-width:2px,color:#fff;
    classDef shadow stroke-dasharray: 5 5;

    subgraph WORKSPACE ["<br/><b>⚡ THE CONTENT WORKSPACE</b><br/><i>Modern React Frontend</i>"]
        direction TB
        A[<b>Rich Editor</b><br/>Post Draft Area]:::client
        B[<b>Persona Engine</b><br/>Resume Context]:::client
        C[<b>Unicode Engine</b><br/>Rich Text Layer]:::client
    end

    subgraph ENGINE ["<br/><b>🛡️ AGENTIC CORE</b><br/><i>Node.js Backend Orchestrator</i>"]
        direction TB
        D{<b>The Dispatcher</b><br/>Correlation Tracing}:::server
        E[<b>Gemini Svc</b><br/>Prompt Tuning]:::server
        F[<b>Resilience Mgr</b><br/>Retry & Backoff]:::server
    end

    subgraph MODELS ["<br/><b>🧠 INTELLIGENCE</b><br/><i>Generative AI</i>"]
        G((<b>Gemini 1.5 Flash</b><br/>JSON Mode)):::ai
    end

    subgraph PUBLISH ["<br/><b>🌐 DESTINATION</b><br/><i>API Mesh</i>"]
        H[<b>LinkedIn API</b><br/>v2026.01]:::linkedin
    end

    %% Connectivity
    A <--> B
    A --> C
    C --> D
    D --> E
    E <--> F
    E <==> G
    D ==> H

    %% Layout Tuning
    style WORKSPACE fill:#fafafa,stroke:#e2e8f0,stroke-width:1px,stroke-dasharray: 5 5;
    style ENGINE fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,stroke-dasharray: 5 5;
    style MODELS fill:#fffef3,stroke:#fef08a,stroke-width:1px,stroke-dasharray: 5 5;
    style PUBLISH fill:#f0f9ff,stroke:#bae6fd,stroke-width:1px,stroke-dasharray: 5 5;
```

---

## � Key Architectural Innovations

### 1. **Contextual Persona Grounding**
Unlike generic AI writers, our engine uses a **Dual-Layer Grounding** approach:
*   **Layer 1 (Authoritative Role)**: Sets the AI to a "Professional AI Architect" persona.
*   **Layer 2 (User Resume Grounding)**: Dynamically injects user-provided resume data into the LLM context, ensuring the output reflects your unique expertise and technical depth.

### 2. **Rich Text Unicode Engine**
LinkedIn does not natively support Markdown. Our system features a custom translation layer that converts standard text into **Mathematical Alphanumeric Symbols (Unicode)**, enabling:
*   **Bold (𝐚𝐛𝐜)** and *Italic (𝘢𝘣𝘤)* formatting directly in the LinkedIn feed.
*   **Zero-Loss Encoding**: Ensures accessibility readers still parse the content correctly while looking premium.

### 3. **AI-Assisted Visual Hierarchy (Smart Polish)**
The **Smart Format** feature uses a secondary LLM pass to analyze the visual hierarchy of the post. It identifies:
*   Primary technical concepts for **Bold** emphasis.
*   Strategic action verbs for *Italic* emphasis.
*   Optimized spacing for "scroll-stop" readability.

### 4. **Resiliency & Observability**
*   **Exponential Backoff**: Integrated `async-retry` logic to handle LLM rate limits or transient outages.
*   **End-to-End Tracing**: Every event from UI click to LLM response is tagged with a unique `Correlation-ID` for production-grade debugging via Winston logs.

---

## �️ Setup & Deployment

### **Prerequisites**
- Docker (20.x+) & Docker Compose
- Google AI Studio API Key

### **1. Environment Configuration**
```bash
# Clone the repository
git clone https://github.com/your-repo/PostEnhancer.git
cd PostEnhancer

# Create environment file
cp .env.example .env
# Edit .env with your GEMINI_API_KEY
```

### **2. Launch Containerized Environment**
```bash
docker-compose up --build
```
*   **Frontend**: `http://localhost:5173`
*   **API Documentation**: `http://localhost:3000/api/enhance` (POST)

---

## 🏗️ Engineering Standards
*   **SOLID Principles**: Modular service layer for easy replacement of LLM providers.
*   **Container Abstraction**: Entire stack is environment-agnostic via Docker.
*   **Strict JSON Interface**: Uses Gemini's `responseMimeType: "application/json"` to ensure 0% hallucination in response structures.
*   **Winston Logging**: Structured JSON logging for ELK-stack compatibility.

---

## 🛣️ Project Evolution
- [x] **Phase 1**: Core Transformation Engine (React/Node/Gemini).
- [x] **Phase 2**: Direct LinkedIn API Integration.
- [x] **Phase 3**: Custom Persona & Resume Grounding.
- [x] **Phase 4**: Rich Text Unicode Engine & Smart Format.
- [ ] **Phase 5**: Multi-modal Support (Auto-generate Infographics via Mermaid).
- [ ] **Phase 6**: Sentiment & Engagement Predictive Scoring.

---

## 📄 License
Licensed under the [MIT License](LICENSE). 
*Designed for Architects. Built for Impact.*
