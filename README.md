# 🏗️ PostEnhancer: LinkedIn Content Engine

An enterprise-grade, AI-native workspace designed to transform raw technical thoughts into high-authority LinkedIn content. Grounded in your professional persona and optimized for executive-level engagement.

![Tech Stack](https://img.shields.io/badge/Stack-React_|_Node_|_Docker-blue.svg)
![AI Engine](https://img.shields.io/badge/AI-Gemini_1.5_Flash-orange.svg)
![Architecture](https://img.shields.io/badge/Architecture-SOLID_|_Hexagonal-green.svg)
![Formatting](https://img.shields.io/badge/Formatting-Rich_Unicode-blueviolet.svg)

---

## ✨ Visual Showcase

<table>
  <tr>
    <td width="50%"><img src="./assets/hero_mockup.png" alt="Workspace Overview"/><br/><sub><b>Workspace Overview</b>: Dual-pane AI editor with premium LinkedIn preview.</sub></td>
    <td width="50%"><img src="./assets/persona_panel.png" alt="Persona Grounding"/><br/><sub><b>Persona Grounding</b>: Tailoring AI output to your specific technical expertise.</sub></td>
  </tr>
  <tr>
    <td colspan="2"><img src="./assets/smart_polish.png" alt="AI Smart Polish"/><br/><sub><b>AI Smart Polish</b>: Dynamic Unicode transformation for automated visual hierarchy.</sub></td>
  </tr>
  <tr>
    <td colspan="2"><img src="./assets/demo.webp" alt="Full Product Demo"/><br/><sub><b>Animated Demo</b>: Watch the PostEnhancer workflow in action.</sub></td>
  </tr>
</table>

---

## �️ System Architecture

The application implements a decoupled Hexagonal-inspired architecture, ensuring maximum resilience and horizontal scalability.

```mermaid
graph LR
    %% Global Stylings
    classDef client fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;
    classDef server fill:#0f172a,stroke:#334155,stroke-width:2px,color:#fff;
    classDef ai fill:#f59e0b,stroke:#d97706,stroke-width:3px,color:#fff;
    classDef linkedin fill:#0077b5,stroke:#005a87,stroke-width:2px,color:#fff;

    subgraph UI ["WORKSPACE"]
        A[Rich Editor]:::client
        B[Persona Engine]:::client
        C[Unicode Engine]:::client
    end

    subgraph BACKEND ["ENGINE"]
        D{Dispatcher}:::server
        E[Gemini Svc]:::server
        F[Resilience]:::server
    end

    subgraph INTELLIGENCE ["BRAIN"]
        G((Gemini 1.5)):::ai
    end

    subgraph MESH ["MESH"]
        H[LinkedIn API]:::linkedin
    end

    %% Flow
    A <--> B
    A --> C
    C --> D
    D --> E
    E <--> F
    E <==> G
    D ==> H

    %% Aesthetic Tuning
    style UI fill:#f8faff,stroke:#e2e8f0,stroke-dasharray: 5 5
    style BACKEND fill:#f8fafc,stroke:#cbd5e1,stroke-dasharray: 5 5
    style INTELLIGENCE fill:#fffef3,stroke:#fef08a,stroke-dasharray: 5 5
    style MESH fill:#f0f9ff,stroke:#bae6fd,stroke-dasharray: 5 5
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
