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

  const jsonData = JSON.stringify(file.data, null, 2);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
  res.status(200).send(jsonData);
}
