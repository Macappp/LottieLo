# Lottie Animation Editor

## Overview

A fully-featured serverless Lottie animation editor built with Next.js and React. Allows users to upload, edit, preview, and optimize Lottie JSON animations with a professional Canva-like UI. The application runs entirely on serverless infrastructure, designed for deployment to Vercel.

**Status**: ✅ Fully implemented and functional

## Recent Changes

**October 22, 2025**: Complete implementation of Lottie Editor
- Built all core utilities (session management, Lottie manipulation, file parsing)
- Implemented all API routes (upload, file operations, batch processing, session management)
- Created all React components (UploadArea, Canvas, LayerPanel, PalettePicker, BatchManager)
- Built homepage with file upload and batch operations
- Built editor page with full editing capabilities
- Implemented Canva-like UI design with modern styling
- Configured development workflow on port 5000

## User Preferences

Preferred communication style: Simple, everyday language.

## Project Architecture

### Frontend Architecture

**Framework**: Next.js (Pages Router) with React 19 and TypeScript

**Pages**:
- **Homepage (`pages/index.tsx`)**: File upload interface with drag-and-drop, URL import, and batch operation manager. Shows grid of uploaded animations.
- **Editor Page (`pages/editor/[id].tsx`)**: Full-featured editor with canvas, layer panel, palette picker, and editing controls.

**Component Structure**:
- `UploadArea`: Drag-and-drop file uploads and URL-based imports
- `Canvas`: Renders Lottie animations using lottie-web library with playback controls, zoom, frame scrubbing, and grid overlay
- `LayerPanel`: Displays animation layers in a tree structure, allows multi-selection, and property editing (fill color, stroke color, opacity)
- `PalettePicker`: Preset and custom color palette selection with live preview
- `BatchManager`: Bulk operations across multiple files (optimize, apply palette)

**Styling**: Custom CSS with Canva-like design (purple gradient header, card-based layout, smooth animations)

**State Management**: React hooks (useState, useEffect) for local component state

### Backend Architecture

**Serverless API Routes**: All backend logic implemented as Next.js API routes

**API Endpoints**:
- `POST /api/upload`: File upload (multipart or JSON body with URL)
- `GET /api/file/[id]`: Retrieve animation data
- `GET /api/file/[id]/metadata`: Get animation metadata
- `POST /api/file/[id]/edit-layer`: Update layer properties (colors, opacity)
- `POST /api/file/[id]/apply-palette`: Apply color palette to layers
- `POST /api/file/[id]/optimize`: Optimize animation (remove hidden layers, round precision)
- `GET /api/file/[id]/export`: Download edited animation as JSON
- `POST /api/batch`: Batch operations on multiple files
- `GET /api/session/[sessionId]/files`: List all files in session
- `GET /api/health`: Health check endpoint

**Session Management**:
- In-memory session storage using singleton SessionManager class
- Cookie-based session identification (HttpOnly, SameSite=Strict)
- 24-hour session timeout with automatic cleanup
- **Note**: Sessions are not persisted to database; data lost on server restart

**File Processing**:
- Multi-format support: JSON files, ZIP archives (extracts data.json)
- File parsing using `formidable` for multipart uploads
- ZIP extraction using `adm-zip`
- Remote URL fetching capability
- 20MB file size limit

**Core Operations** (in `lib/lottieUtils.ts`):
- `updateLayerProperties`: Modify layer colors and opacity
- `applyPalette`: Apply color scheme across selected layers
- `optimizeLottie`: Remove hidden layers, round precision, reduce file size

### Data Storage

**Current Implementation**: In-memory storage using JavaScript Map objects

**Session Structure**:
```typescript
{
  id: string,
  files: Map<fileId, LottieFile>,
  createdAt: timestamp
}
```

**LottieFile Structure**:
```typescript
{
  id: string,
  name: string,
  data: any, // Full Lottie JSON
  frames: number,
  width: number,
  height: number,
  frameRate: number,
  uploadedAt: timestamp
}
```

**Important Note**: Data is stored in memory per the specification. For production deployment, consider adding:
- Vercel KV (Redis) for session persistence
- PostgreSQL database for permanent storage
- AWS S3 for file storage

### Authentication & Authorization

**Current State**: No user authentication

**Session Security**: HttpOnly cookies with SameSite=Strict prevent XSS and CSRF

**File Access Control**: Session-based isolation (users can only access their own files)

## External Dependencies

### NPM Packages

**Core Framework**:
- `next` (^15.2.3): React framework with serverless API routes
- `react` (^19.0.0): UI library
- `react-dom` (^19.0.0): React rendering

**File Processing**:
- `formidable` (^3.5.4): Multipart form data parsing
- `adm-zip` (^0.5.16): ZIP file extraction
- `uuid` (^13.0.0): Unique ID generation

**Animation**:
- `lottie-web` (^5.13.0): Lottie rendering engine

**Styling**:
- `tailwindcss` (^4.0.15): Utility-first CSS framework

**Development**:
- `typescript` (^5.8.2): Type safety
- `eslint` (^9.23.0): Code linting
- `eslint-config-next` (^15.2.3): Next.js ESLint config

### Deployment

**Target Platform**: Vercel (serverless deployment)

**Configuration**: 
- Next.js config allows Replit preview domains
- Development server on port 5000 with 0.0.0.0 hostname
- No custom server required

## Directory Structure

```
.
├── components/          # React components
│   ├── UploadArea.tsx
│   ├── Canvas.tsx
│   ├── LayerPanel.tsx
│   ├── PalettePicker.tsx
│   └── BatchManager.tsx
├── lib/                 # Utility functions
│   ├── sessionManager.ts
│   ├── lottieUtils.ts
│   └── fileParser.ts
├── pages/               # Next.js pages and API routes
│   ├── index.tsx
│   ├── editor/
│   │   └── [id].tsx
│   └── api/
│       ├── upload.ts
│       ├── batch.ts
│       ├── health.ts
│       ├── file/
│       │   ├── [id].ts
│       │   └── [id]/
│       │       ├── metadata.ts
│       │       ├── edit-layer.ts
│       │       ├── apply-palette.ts
│       │       ├── optimize.ts
│       │       └── export.ts
│       └── session/
│           └── [sessionId]/
│               └── files.ts
└── styles/
    └── globals.css      # Global styles (Canva-like design)
```

## Features Implemented

✅ File Upload
- Drag-and-drop interface
- Multi-file upload
- URL-based import
- ZIP file support
- JSON validation

✅ Animation Preview
- Play/pause controls
- Frame scrubbing
- Zoom controls (25% - 200%)
- Grid overlay toggle
- Smooth playback

✅ Layer Editing
- Layer tree display
- Multi-layer selection (Ctrl/Cmd + click)
- Fill color editing
- Stroke color editing
- Opacity adjustment
- Real-time preview

✅ Color Palettes
- 5 preset palettes (Sunset, Ocean, Forest, Purple Dream, Fire)
- Custom palette creation
- Apply to selected layers or all layers
- Live preview

✅ Optimization
- Remove hidden layers
- Round keyframe precision
- Show before/after statistics
- Size reduction reporting

✅ Batch Operations
- Multi-file selection
- Batch optimize
- Batch palette application
- Progress tracking
- Per-file results

✅ Session Management
- Cookie-based sessions
- Automatic session creation
- 24-hour timeout
- Session isolation

✅ Export
- Download edited JSON
- Original filename preservation

## Next Steps for Production

While the app is fully functional, consider these enhancements for production deployment:

1. **Add Persistence**: Replace in-memory storage with Vercel KV, PostgreSQL, or Redis
2. **User Authentication**: Add login system (e.g., Replit Auth, NextAuth.js)
3. **File Size Limits**: Implement user quotas
4. **CDN Integration**: Serve exported files from CDN
5. **Error Tracking**: Add Sentry or similar for error monitoring
6. **Analytics**: Track usage patterns
7. **Rate Limiting**: Prevent API abuse
8. **Tests**: Add integration and unit tests
