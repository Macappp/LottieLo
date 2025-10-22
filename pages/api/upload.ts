import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { sessionManager } from '../../lib/sessionManager';
import { parseUploadedFiles, fetchRemoteFile } from '../../lib/fileParser';
import { extractMetadata } from '../../lib/lottieUtils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = req.cookies.sessionId || sessionManager.createSession();
    
    if (!req.cookies.sessionId) {
      res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict`);
    }

    let lottieDataArray: any[] = [];

    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      lottieDataArray = await parseUploadedFiles(req);
    } else if (contentType.includes('application/json')) {
      const body = await new Promise<any>((resolve) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => resolve(JSON.parse(data)));
      });

      if (body.url) {
        const data = await fetchRemoteFile(body.url);
        lottieDataArray.push(data);
      } else if (body.urls && Array.isArray(body.urls)) {
        for (const url of body.urls) {
          try {
            const data = await fetchRemoteFile(url);
            lottieDataArray.push(data);
          } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
          }
        }
      } else if (body.data) {
        lottieDataArray.push(body.data);
      }
    }

    const uploadedFiles = lottieDataArray.map((data) => {
      const fileId = uuidv4();
      const metadata = extractMetadata(data);

      const file = {
        id: fileId,
        name: data.nm || `animation-${fileId.substring(0, 8)}`,
        data,
        ...metadata,
        uploadedAt: Date.now(),
      };

      sessionManager.addFile(sessionId, file);
      
      return {
        id: file.id,
        name: file.name,
        frames: file.frames,
        width: file.width,
        height: file.height,
        frameRate: file.frameRate,
      };
    });

    res.status(200).json({ 
      files: uploadedFiles,
      sessionId 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
}
