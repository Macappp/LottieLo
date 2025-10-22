import type { NextApiRequest, NextApiResponse } from 'next';
import { sessionManager } from '../../../lib/sessionManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionId = req.cookies.sessionId;
  
  console.log('File request - sessionId:', sessionId);
  sessionManager.debugSessions();
  
  if (!sessionId) {
    console.log('No session ID found in cookies');
    return res.status(401).json({ error: 'No session found' });
  }

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid file ID' });
  }

  const file = sessionManager.getFile(sessionId, id);
  if (!file) {
    console.log(`File ${id} not found in session ${sessionId}`);
    return res.status(404).json({ error: 'File not found' });
  }

  res.status(200).json(file.data);
}
