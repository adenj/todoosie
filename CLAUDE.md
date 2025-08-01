# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (runs TypeScript compiler then Vite build)
- `pnpm lint` - Run ESLint on all files
- `pnpm preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript + Vite application using Chakra UI v3 for the component library.

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with HMR support
- **UI Library**: Chakra UI v3 with emotion for styling
- **Theming**: next-themes for color mode switching
- **Icons**: react-icons
- **Package Manager**: pnpm

### Project Structure
- `src/main.tsx` - Application entry point with ChakraProvider setup
- `src/App.tsx` - Main application component
- `src/components/ui/` - Chakra UI component abstractions and providers
  - `provider.tsx` - Main ChakraProvider wrapper with color mode support
  - `color-mode.tsx` - Color mode (light/dark theme) functionality
  - `toaster.tsx`, `tooltip.tsx` - UI utility components

### Key Implementation Details
- Uses Vite's `tsconfigPaths` plugin for path aliases (imports with `@/`)
- Chakra UI v3 setup with `defaultSystem` configuration
- Color mode provider integrated for theme switching
- TypeScript configured with strict settings across multiple config files
- ESLint configured with React Hooks and React Refresh plugins

### Development Notes
- The app currently has minimal functionality (single button component)
- Chakra UI components are imported from `@chakra-ui/react`
- Path aliases configured to use `@/` for src directory imports
- All components use TypeScript with strict type checking

---
### User Notes
- This project uses TypeScript, so ensure to type everything when possible, avoiding use of `any` and `unknown` where possible