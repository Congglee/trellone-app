# Product Context for Trellone

## Core Purpose & Vision

Trellone is a feature-rich, self-hostable project management application designed as a clone of Trello. It aims to provide a visually intuitive and highly collaborative platform for teams to organize tasks, manage workflows, and track progress in real-time. The vision is to offer an open-source, modern alternative to Trello that developers can easily extend and integrate into their own infrastructure.

## Key Problems Addressed

- **Lack of Self-Hosted Trello Alternatives:** Provides a solution for teams that require data privacy and control by allowing them to host their own project management tool.
- **Real-Time Collaboration Gaps:** Ensures that all team members are on the same page with instant updates to boards, columns, and cards, powered by WebSockets.
- **Fragmented User Experience:** Delivers a polished, single-page application (SPA) experience with a consistent and responsive UI built on Material-UI, eliminating page reloads and providing a fluid workflow.
- **Complex UI State Management:** Solves the challenge of managing complex application state by using Redux Toolkit, RTK Query for data fetching, and Redux Persist for preserving user sessions.

## Target Audience & User Personas

- **Development Teams:** For planning sprints, tracking bugs, and managing feature backlogs.
- **Project Managers:** To oversee project progress, assign tasks, and coordinate work across different team members.
- **Small to Medium-Sized Businesses (SMBs):** For organizing internal projects, tracking deliverables, and managing team workflows without relying on third-party SaaS providers.
- **Open Source Projects:** To provide a transparent and accessible way to manage community contributions and development roadmaps.

## How It Should Work: Core User Workflows

1.  **Authentication & Onboarding:**

    - Users can register for a new account, log in with credentials, or use OAuth providers.
    - Upon first login, users are guided to create or join a workspace.

2.  **Workspace & Board Management:**

    - Users can create multiple workspaces to segregate different projects or teams.
    - Within a workspace, users can create boards, which can be public or private.
    - Members can be invited to workspaces and boards with specific roles and permissions.

3.  **Board Interaction (Trello-like UX):**

    - Boards consist of columns (e.g., "To Do," "In Progress," "Done") that represent stages of a workflow.
    - Cards, representing individual tasks, can be created within columns.
    - Users can drag and drop cards between columns to update their status in real-time.
    - Columns can also be reordered via drag and drop.

4.  **Card Details & Collaboration:**

    - Clicking a card opens a detailed modal view.
    - Within the modal, users can add markdown descriptions, set due dates, upload attachments, and add comments.
    - Team members can react to comments and cards with emojis.
    - All updates (comments, attachments, etc.) are synchronized in real-time across all connected clients.

5.  **Real-Time Collaboration:**
    - Changes made by one user are instantly reflected for all other usersViewing the same board.
    - The system uses Socket.IO for resilient, real-time communication with the backend.

## User Experience (UX) Goals

- **Intuitive & Familiar:** The UI should feel immediately familiar to anyone who has used Trello or similar kanban-style tools.
- **Responsive & Fast:** The application must be fast and responsive, with sub-second UI updates and smooth animations, leveraging Vite's performance and React's virtual DOM.
- **Polished & Professional:** The aesthetic, powered by Material-UI, should be clean, modern, and professional, with both light and dark modes to suit user preferences.
- **Seamless & Uninterrupted:** As a single-page application, all interactions should feel seamless, with no full-page reloads. Modals, dialogs, and optimistic UI updates contribute to this fluid experience.
- **Accessible:** The application should adhere to accessibility best practices, ensuring it is usable by as many people as possible.
