import AdmZip from 'adm-zip';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs';

export async function parseUploadedFiles(req: NextApiRequest): Promise<any[]> {
  const form = new IncomingForm({
    maxFileSize: 20 * 1024 * 1024, // 20MB
    multiples: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      const uploadedFiles: any[] = [];
      const fileArray = Array.isArray(files.file) ? files.file : files.file ? [files.file] : [];

      for (const file of fileArray) {
        try {
          const data = await processFile(file as FormidableFile);
          if (data) uploadedFiles.push(data);
        } catch (error) {
          console.error('Error processing file:', error);
        }
      }

      resolve(uploadedFiles);
    });
  });
}

async function processFile(file: FormidableFile): Promise<any> {
  const filePath = file.filepath;
  const fileName = file.originalFilename || 'unknown';

  if (fileName.endsWith('.json')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } else if (fileName.endsWith('.zip')) {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    
    for (const entry of zipEntries) {
      if (entry.entryName.endsWith('.json') || entry.entryName === 'data.json') {
        const content = entry.getData().toString('utf-8');
        return JSON.parse(content);
      }
    }
  }

  return null;
}

export async function fetchRemoteFile(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${url}`);
  }

  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return await response.json();
  } else if (contentType?.includes('application/zip')) {
    const buffer = await response.arrayBuffer();
    const zip = new AdmZip(Buffer.from(buffer));
    const zipEntries = zip.getEntries();
    
    for (const entry of zipEntries) {
      if (entry.entryName.endsWith('.json') || entry.entryName === 'data.json') {
        const content = entry.getData().toString('utf-8');
        return JSON.parse(content);
      }
    }
  }

  throw new Error('Unsupported file format');
}
