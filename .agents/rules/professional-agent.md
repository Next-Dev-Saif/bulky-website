---
trigger: always_on
---

At start of every conversation, you will read the (agent-guiders) directory all md files, The standards or rules are described inside agent-guiders folder in current directory , each reference written in this document is present inside agent-guiders folder.

# Agent Guidance: The Master Index

This document serves as the central directory for all development, behavioral, and architectural guidelines that define the AI Agent's execution parameters.

**Instruction to Agent:** When dealing with a specific domain, refer to the corresponding `.md` file below to ensure alignment with the project's strict standards.

---

## 🧠 Core Identity & Behavior

Define _who_ the agent is and _how_ it should execute tasks.

- **[Dev-Personality.md](./Dev-Personality.md):** Defines the Senior Web Engineer persona, strict communication rules, and the "No Yes-Man" pushback protocol.
- **[Agent-execution-guide.md](./Agent-execution-guide.md):** Step-by-step methodology for executing tasks safely without disrupting the codebase.

## 🏗 Architecture & Ecosystem

Framework-specific standards and data flow guidelines.

- **[Next-js-app-architecture-guide.md](./Next-js-app-architecture-guide.md):** Directory alignment, App Router rules, and Next.js specific standards.
- **[React-js-app-architecture-guide.md](./React-js-app-architecture-guide.md):** Vite/React folder architecture and client-side orchestration.
- **[State-management-guide.md](./State-management-guide.md):** The hierarchy of state (URL vs Local vs Global vs Server).
- **[API-integration-guide.md](./API-integration-guide.md):** Centralized fetchers, global error handling, and optimistic UI rules.

## 🎨 UI/UX & Inclusive Design

Making the web beautiful, human-like, and accessible.

- **[UI-UX-design-guideline.md](./UI-UX-design-guideline.md):** Rules for crafting professional, non-artificial, human-centric interfaces.
- **[Accessibility-a11y-guideline.md](./Accessibility-a11y-guideline.md):** Keyboard navigation, ARIA standards, and semantic HTML requirements.

## ⚡ Development Operations & Standards

Advanced tricks, performance, and best practices.

- **[Creative-web-tricks.md](./Creative-web-tricks.md):** Bleeding-edge 2026 web capabilities, RSC, native popovers, and CSS anchor positioning.
- **[Performance-optimization.md](./Performance-optimization.md):** Web Vitals, code-splitting, rendering strategies, and avoiding memory leaks.
- **[Security-guidelines.md](./Security-guidelines.md):** XSS prevention, token storage, and secure state handling.
- **[Web-Standards.md](./Web-Standards.md):** The HTML/CSS/JS trinity and core web responsiveness.

## 🛠 Code Quality & Maintenance

Ensuring the codebase remains pristine long-term.

- **[Refactoring-and-Code-Review.md](./Refactoring-and-Code-Review.md):** The Boy Scout Rule, PR standards, and safe iteration techniques.
- **[Testing-QA-guideline.md](./Testing-QA-guideline.md):** Behavioral testing rules, E2E strategies, and QA checklists.
- **[Git-and-Version-Control.md](./Git-and-Version-Control.md):** Conventional commits, branch naming, and history cleanliness.
