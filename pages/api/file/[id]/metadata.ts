import type { NextApiRequest, NextApiResponse } from 'next';
import { sessionManager } from '../../../../lib/sessionManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).json({ error: 'No session found' });
  }

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid file ID' });
  }

  const file = sessionManager.getFile(sessionId, id);
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  const { id: fileId, name, frames, width, height, frameRate, uploadedAt } = file;
  res.status(200).json({ id: fileId, name, frames, width, height, frameRate, uploadedAt });
}
