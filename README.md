# Knowledge Auditor

A web app that helps you organize bookmarks and map them to your projects using AI. Sign in, add bookmarks and projects, then use AI to automatically link relevant bookmarks to each project—or manually drag-and-drop.

---

## Features

- **Authentication** – Sign up or log in with email
- **Bookmarks** – Add URLs; metadata (title, description) is fetched automatically
- **Projects/Tasks** – Create projects with name, due date, description, and priority (High/Medium/Low)
- **AI Link Mapping** – Map Links uses Google Gemini to match bookmarks to projects based on context
- **Drag & Drop** – Manually attach bookmarks to projects by dragging
- **Supabase** – Data stored in Supabase (auth, Bookmarks, Projects)

---

## Prerequisites

- Node.js (v18+)
- A [Supabase](https://supabase.com) project
- A [Google AI](https://ai.google.dev/) API key (for Gemini)

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo-url>
cd Knowledge-Auditor
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

- **Supabase** – Create a project at [supabase.com](https://supabase.com), then get the URL and anon key from Project Settings → API
- **Gemini** – Create an API key at [ai.google.dev](https://ai.google.dev/)

### 3. Supabase database

Create these tables in your Supabase project:

**Bookmarks**

| Column      | Type    |
|-------------|---------|
| `url_id`    | uuid (primary key, default `gen_random_uuid()`) |
| `url`       | text    |
| `title`     | text    |
| `description` | text  |

**Projects**

| Column          | Type     |
|-----------------|----------|
| `proj_id`       | uuid (primary key, default `gen_random_uuid()`) |
| `project_name`  | text     |
| `project_details` | text   |
| `due_by`        | date     |
| `priority`      | text     |
| `status`        | boolean  |
| `links`         | jsonb    |

Enable Row Level Security (RLS) and define policies so users only access their own data (e.g. using `auth.uid()`).

---

## Running the app

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` (or the port Vite shows).

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## How to use

### 1. Sign up / log in

- Use the auth page to create an account or sign in.

### 2. Add bookmarks

- Paste a URL in **Add a new bookmark**
- Click **Add bookmark**
- The app fetches title and description via noembed (YouTube) or Microlink (other sites).

### 3. Add projects

- Click **Add a new task**
- Enter project name, due date, description, and priority
- Click **List Project**

### 4. Map links

**Option A: AI mapping**

- Add bookmarks and projects
- Click **Map Links**
- The app uses Gemini to match bookmarks to projects based on names and descriptions
- Results are saved to each project’s `links`

**Option B: Manual mapping**

- Drag a bookmark from the left panel and drop it on a project on the right
- The link is attached to that project immediately

### 5. Manage links

- Click a project to expand it and see its links
- Click the trash icon next to a link to remove it from that project
- Use the priority filters (H/M/L) to show or hide projects by priority

---

## Tech stack

- React 19 + Vite
- Supabase (auth + DB)
- Google Gemini (AI link mapping)
- noembed / Microlink (metadata)

---

## Scripts

| Command       | Description                |
|---------------|----------------------------|
| `npm run dev` | Start dev server           |
| `npm run build` | Build for production    |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint                |
