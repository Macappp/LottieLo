import type { NextApiRequest, NextApiResponse } from 'next';
import { sessionManager } from '../../lib/sessionManager';
import { optimizeLottie, applyPalette } from '../../lib/lottieUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({ error: 'No session found' });
    }

    const { fileIds, operation, palette } = req.body;

    if (!fileIds || !Array.isArray(fileIds)) {
      return res.status(400).json({ error: 'Invalid fileIds' });
    }

    const results = await Promise.all(
      fileIds.map(async (fileId: string) => {
        try {
          const file = sessionManager.getFile(sessionId, fileId);
          if (!file) {
            return { fileId, status: 'error', message: 'File not found' };
          }

          let result: any = { fileId, status: 'success' };

          if (operation === 'optimize') {
            const optimized = optimizeLottie(file.data);
            sessionManager.updateFile(sessionId, fileId, optimized.data);
            result = { ...result, ...optimized.stats };
          } else if (operation === 'applyPalette' && palette) {
            const updated = applyPalette(file.data, palette);
            sessionManager.updateFile(sessionId, fileId, updated);
            result.message = 'Palette applied';
          } else {
            return { fileId, status: 'error', message: 'Unknown operation' };
          }

          return result;
        } catch (error: any) {
          return { fileId, status: 'error', message: error.message };
        }
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error('Batch error:', error);
    res.status(500).json({ error: 'Batch operation failed' });
  }
}
