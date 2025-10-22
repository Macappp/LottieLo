import { v4 as uuidv4 } from 'uuid';

interface LottieFile {
  id: string;
  name: string;
  data: any;
  frames: number;
  width: number;
  height: number;
  frameRate: number;
  layers?: any[];
  uploadedAt: number;
}

interface Session {
  id: string;
  files: Map<string, LottieFile>;
  createdAt: number;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private readonly SESSION_TIMEOUT = 1000 * 60 * 60 * 24; // 24 hours

  createSession(): string {
    const sessionId = uuidv4();
    this.sessions.set(sessionId, {
      id: sessionId,
      files: new Map(),
      createdAt: Date.now(),
    });
    this.cleanupOldSessions();
    console.log(`Created session: ${sessionId}`);
    return sessionId;
  }

  getOrCreateSession(sessionId?: string): string {
    if (sessionId && this.sessions.has(sessionId)) {
      return sessionId;
    }
    return this.createSession();
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  addFile(sessionId: string, file: LottieFile): void {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        files: new Map(),
        createdAt: Date.now(),
      };
      this.sessions.set(sessionId, session);
    }
    session.files.set(file.id, file);
    console.log(`Added file ${file.id} to session ${sessionId}. Total files: ${session.files.size}`);
  }

  getFile(sessionId: string, fileId: string): LottieFile | undefined {
    const session = this.sessions.get(sessionId);
    const file = session?.files.get(fileId);
    console.log(`Getting file ${fileId} from session ${sessionId}: ${file ? 'found' : 'not found'}`);
    return file;
  }

  updateFile(sessionId: string, fileId: string, data: any): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      const file = session.files.get(fileId);
      if (file) {
        file.data = data;
      }
    }
  }

  getSessionFiles(sessionId: string): LottieFile[] {
    const session = this.sessions.get(sessionId);
    return session ? Array.from(session.files.values()) : [];
  }

  private cleanupOldSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.createdAt > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
        console.log(`Cleaned up old session: ${sessionId}`);
      }
    }
  }

  debugSessions(): void {
    console.log(`Total sessions: ${this.sessions.size}`);
    for (const [sessionId, session] of this.sessions.entries()) {
      console.log(`  Session ${sessionId}: ${session.files.size} files`);
    }
  }
}

// Use globalThis to persist across hot reloads in development
const globalForSessionManager = globalThis as unknown as {
  sessionManager: SessionManager | undefined;
};

export const sessionManager = globalForSessionManager.sessionManager ?? new SessionManager();

if (process.env.NODE_ENV !== 'production') {
  globalForSessionManager.sessionManager = sessionManager;
}

export type { LottieFile, Session };
