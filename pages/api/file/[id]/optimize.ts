import type { NextApiRequest, NextApiResponse } from 'next';
import { sessionManager } from '../../../../lib/sessionManager';
import { optimizeLottie } from '../../../../lib/lottieUtils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  try {
    const result = optimizeLottie(file.data);
    sessionManager.updateFile(sessionId, id, result.data);

    res.status(200).json(result.stats);
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize' });
  }
}
