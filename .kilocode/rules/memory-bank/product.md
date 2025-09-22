# Trellone Product

## Purpose

Trellone is a modern Trello‑style project management SPA that helps teams organize work into workspaces, boards, columns and cards with real‑time collaboration. It focuses on speed, reliability, and an accessible UI powered by Material‑UI.

## Target users

- Teams and small to medium organizations coordinating projects and tasks
- Individuals needing structured lists, Kanban flows, and simple collaboration
- Guests and external collaborators via invitations

## Problems solved

- Fragmented task tracking across tools and spreadsheets
- Lack of real‑time visibility into team activity
- Inconsistent UX and slow interfaces for day‑to‑day task operations
- Complex authentication and session persistence across sessions and tabs

## Core domain objects and relationships

- Workspace
  - Contains many Boards and members with roles
- Board
  - Contains many Columns and board members
- Column
  - Contains many Cards with orderable positions
- Card
  - Fields: title, description (Markdown), assignees, attachments, due dates, comments
  - Reorderable across columns (drag‑and‑drop)

## Core capabilities

- Drag‑and‑drop columns and cards using @dnd‑kit
- Authentication: login, register, email verification, forgot/reset password
- OAuth sign‑in (Google)
- Invitations workflow for workspaces and boards
- Real‑time collaboration via Socket.IO (rooms for workspaces and indices)
- Comments, attachments (links and media), Markdown editing (sanitized)
- Notifications and toasts for feedback
- Search and SEO‑ready pages using react‑helmet‑async
- Responsive, accessible UI (MUI, sx theming)

## High‑level user journeys

- Account creation and sign‑in
  - Email/password registration; email verification
  - Login with JWT session persistence and refresh token handling
  - OAuth redirect flow (Google)
- Workspace lifecycle
  - Create workspace; invite members; manage roles and visibility
  - Navigate workspace boards; view members and guests
- Board lifecycle
  - Create, rename, archive/unarchive boards
  - Add columns; drag to reorder; manage board membership
- Card lifecycle
  - Create, edit, move across columns
  - Add description (Markdown), attachments, comments, due dates
  - Assign members; manage checklists (when supported)
- Collaboration
  - Join rooms on workspace pages
  - Receive real‑time updates on changes (members/boards/columns/cards)
  - Automatic reconnect with updated auth header on token refresh
- Profile and settings
  - View and update profile; change password with re‑auth behavior
  - Logout with cache reset across API slices

## Real‑time collaboration behavior

- Socket.IO client authenticates with Bearer token; updates auth on reconnect
- Rooms:
  - Workspaces index room for global changes to the user’s workspace list
  - Specific workspace room for updates scoped to a workspace
- Reconnect handling rejoins needed rooms and schedules data refetches for consistency

## UX goals

- Fast and predictable interactions with optimistic updates where appropriate
- Accessible components and keyboard navigation (MUI + dnd‑kit patterns)
- Clear error and success feedback via toasts
- Mobile‑first responsive layout and adaptive density
- Minimal cognitive load via consistent component patterns and routing

## Non‑functional requirements

- Security: JWT handling with refresh tokens, sanitize user content (Markdown)
- Performance: client caching (RTK Query), debounced queries for search, code‑splitting for large pages
- Reliability: automatic token refresh, socket reconnect, guarded error paths
- Observability: standardized error handling and toast notifications

## What makes Trellone distinct

- Production‑grade front‑end patterns with Redux Toolkit + RTK Query over Axios
- Clean, extensible domain boundaries (workspaces, boards, columns, cards)
- Robust token lifecycle and socket auth refresh for real‑time UX
