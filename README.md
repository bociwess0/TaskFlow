# TaskFlow

A full-stack web application for project and resource management. Besides projects, tasks, Kanban boards and time tracking, TaskFlow answers the question **"who has the capacity to do this?"**: it tracks how each employee is allocated across projects and warns about over-allocation.

Built as a bachelor's thesis project.

## Stack

| Part | Technologies |
|---|---|
| Frontend (`apps/web`) | Vite, React, TypeScript, React Router, Tailwind CSS, shadcn/ui |
| Main API (`apps/api`, planned) | NestJS, Prisma, PostgreSQL, Socket.IO, JWT |
| Analytics service (`apps/analytics`, planned) | ASP.NET Core Web API (C#) |
| Infrastructure (planned) | Docker Compose, Redis |

## Repository structure

```
apps/
  web/        React + Vite frontend
docs/         Project specification and UI design
```

## Getting started

Requirements: Node.js 22.12+ and npm.

```bash
npm install      # install all workspace dependencies
npm run dev      # start the frontend dev server (http://localhost:5173)
npm run lint     # lint the frontend
npm run build    # type-check and build the frontend
```
