# The Daily Scroll - Frontend

This is the frontend user interface for **The Daily Scroll** application. It is a standalone React single-page application built with Vite and TailwindCSS.

## Architecture 

This frontend is entirely decoupled from the backend. 
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4 with Shadcn UI components
- **Routing**: Wouter
- **Data Fetching**: TanStack React Query (`@tanstack/react-query`)
- **API Integration**: Shared, generated API clients and schemas (located in `src/shared/api-client-react` and `src/shared/api-zod`)

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **pnpm** (install via `npm install -g pnpm`)

## Environment Setup

The frontend may require a `.env` file to know where the backend API is located. If it doesn't already exist, create a `.env` file in the root of the `The_daily_scroll_frontend` directory.

Vite typically proxies API requests during development (configured in `vite.config.ts`), so ensure your backend is running on the expected port (usually `5000`).

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd D:\The_Daily_Scroll\The_daily_scroll_frontend
   ```
2. Install the project dependencies using pnpm:
   ```bash
   pnpm install
   ```

*(Note: If you receive a warning about ignored build scripts during installation, such as `esbuild`, you can run `pnpm approve-builds` followed by `pnpm install` to resolve it).*

## Running the Application

**Development Mode:**
Start the Vite development server with hot-module replacement (HMR):
```bash
pnpm run dev
```
Vite will start on `http://localhost:3000` (or the next available port). 

> **Important**: For the frontend to successfully fetch data (like news articles), the backend server must be running simultaneously in a separate terminal.

**Production Mode:**
To build the application for deployment (such as Vercel, Netlify, or a static file host):
```bash
pnpm run build
```
This will output the optimized, minified production files into the `dist/` directory.

To preview your production build locally:
```bash
pnpm run preview
```

## Available Scripts

- `pnpm run dev`: Starts the local development server.
- `pnpm run build`: Type-checks the TypeScript code and bundles the application for production using Vite.
- `pnpm run check`: Runs the TypeScript compiler to check for type errors without emitting files.
- `pnpm run preview`: Locally serves the production build from the `dist/` directory.
