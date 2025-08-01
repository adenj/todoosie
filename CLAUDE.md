# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (runs TypeScript compiler then Vite build)
- `pnpm lint` - Run ESLint on all files
- `pnpm preview` - Preview production build locally

## Architecture Overview

This is a full-stack React todo application with Supabase backend, featuring drag-and-drop reordering, real-time sync, and user authentication.

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with HMR support
- **UI Library**: Chakra UI v3 with emotion for styling
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Icons**: react-icons
- **Package Manager**: pnpm
- **Deployment**: Netlify

### Project Structure
```
src/
├── main.tsx                 # Application entry point with providers
├── App.tsx                  # Auth routing logic (login vs app)
├── components/
│   ├── Auth.tsx            # Login/signup form
│   ├── TodoApp.tsx         # Main app with drag & drop context
│   ├── TodoList.tsx        # Container for todo items
│   ├── TodoItem.tsx        # Individual todo with sortable hooks
│   ├── TodoInput.tsx       # Add new todo form
│   ├── TodoFilters.tsx     # Filter todos (all/active/completed)
│   ├── TodoStats.tsx       # Stats and clear completed button
│   └── ui/                 # Chakra UI components and providers
├── contexts/
│   └── AuthContext.tsx     # Supabase auth state management
├── hooks/
│   └── useTodos.ts         # Todo CRUD operations with Supabase
├── lib/
│   └── supabase.ts         # Supabase client and type definitions
├── types/
│   └── todo.ts             # Todo interface and filter types
└── utils/
    └── localStorage.ts     # Local storage utilities (legacy)
```

### Database Schema
- **todos table** with Row Level Security (RLS)
  - `id` (UUID, primary key)
  - `title` (text)
  - `completed` (boolean)
  - `position` (integer, for drag & drop ordering)
  - `user_id` (UUID, foreign key to auth.users)
  - `created_at`, `updated_at` (timestamps)

### Key Features
1. **User Authentication** - Email/password with Supabase Auth
2. **Todo CRUD** - Create, read, update, delete with optimistic updates
3. **Drag & Drop Reordering** - Uses @dnd-kit with position-based persistence
4. **Real-time Sync** - Changes sync across devices instantly
5. **Filtering** - View all, active, or completed todos
6. **Dark/Light Mode** - Theme switching support
7. **Responsive Design** - Works on desktop and mobile

### Implementation Details
- **Authentication Flow**: AuthContext manages user state, conditional rendering in App.tsx
- **Drag & Drop**: TodoApp wraps TodoList in DndContext + SortableContext, TodoItems use useSortable
- **Real-time Updates**: Supabase subscriptions with collision handling for simultaneous edits
- **Optimistic Updates**: Immediate UI feedback with database sync and error rollback
- **Type Safety**: Full TypeScript coverage with Supabase generated types
- **Row Level Security**: Database policies ensure users only see their own todos

### Environment Variables
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development Notes
- Path aliases configured for `@/` imports
- Strict TypeScript configuration
- ESLint with React Hooks and React Refresh plugins
- Uses `type` imports for better tree-shaking
- Chakra UI v3 with updated component patterns

### Deployment
- **Platform**: Netlify
- **Build**: `pnpm build` outputs to `dist/`
- **Routing**: SPA redirects handled by netlify.toml
- **Environment**: Variables set in Netlify UI (not committed to git)

---
### User Notes
- This project uses TypeScript strictly - avoid `any` and `unknown` types
- Supabase keys are safe to expose in client-side code (protected by RLS)
- Drag & drop requires 8px movement to activate (prevents accidental drags)
- Real-time subscriptions handle concurrent user changes gracefully