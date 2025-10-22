import type { NextApiRequest, NextApiResponse } from 'next';
import { sessionManager } from '../../../../lib/sessionManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId } = req.query;
  if (typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  const files = sessionManager.getSessionFiles(sessionId);
  const filesMetadata = files.map(({ id, name, frames, width, height, frameRate, uploadedAt }) => ({
    id,
    name,
    frames,
    width,
    height,
    frameRate,
    uploadedAt,
  }));

  res.status(200).json({ files: filesMetadata });
}
