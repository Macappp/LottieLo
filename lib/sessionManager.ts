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
    return sessionId;
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  addFile(sessionId: string, file: LottieFile): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.files.set(file.id, file);
    }
  }

  getFile(sessionId: string, fileId: string): LottieFile | undefined {
    const session = this.sessions.get(sessionId);
    return session?.files.get(fileId);
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
      }
    }
  }
}

export const sessionManager = new SessionManager();
export type { LottieFile, Session };
