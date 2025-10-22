import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import UploadArea from '../components/UploadArea';
import BatchManager from '../components/BatchManager';

interface FileMetadata {
  id: string;
  name: string;
  frames: number;
  width: number;
  height: number;
  frameRate: number;
}

const Home: NextPage = () => {
  const router = useRouter();
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showBatch, setShowBatch] = useState(false);

  const handleFileUpload = async (uploadedFiles: File[]) => {
    setIsUploading(true);
    
    const formData = new FormData();
    uploadedFiles.forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setFiles(prev => [...prev, ...data.files]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlUpload = async (url: string) => {
    setIsUploading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setFiles(prev => [...prev, ...data.files]);
    } catch (error) {
      console.error('URL upload error:', error);
      alert('Failed to load file from URL');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBatchOperation = async (operation: string, fileIds: string[], palette?: any) => {
    const response = await fetch('/api/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, fileIds, palette }),
    });

    return await response.json();
  };

  const openEditor = (fileId: string) => {
    router.push(`/editor/${fileId}`);
  };

  return (
    <div className="app-container">
      <Head>
        <title>Lottie Editor - Professional Animation Editor</title>
        <meta name="description" content="Professional Lottie animation editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="logo-icon">⚡</span>
            Lottie Editor
          </h1>
          <p className="app-subtitle">Professional Animation Editor</p>
        </div>
      </header>

      <main className="main-content">
        {files.length === 0 ? (
          <div className="upload-section">
            <UploadArea onUpload={handleFileUpload} onUrlUpload={handleUrlUpload} />
            {isUploading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>Uploading files...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="workspace">
            <div className="workspace-header">
              <h2>Your Animations ({files.length})</h2>
              <div className="header-actions">
                <button onClick={() => setShowBatch(!showBatch)} className="btn-secondary">
                  {showBatch ? 'Hide' : 'Show'} Batch Tools
                </button>
                <button onClick={() => setFiles([])} className="btn-secondary">
                  Clear All
                </button>
              </div>
            </div>

            {showBatch && (
              <div className="batch-section">
                <BatchManager files={files} onBatchOperation={handleBatchOperation} />
              </div>
            )}

            <div className="files-grid">
              {files.map(file => (
                <div key={file.id} className="file-card" onClick={() => openEditor(file.id)}>
                  <div className="file-preview">
                    <div className="preview-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="file-info">
                    <h3 className="file-name">{file.name}</h3>
                    <div className="file-meta">
                      <span>{file.width} × {file.height}</span>
                      <span>{file.frames} frames</span>
                      <span>{file.frameRate} fps</span>
                    </div>
                  </div>
                  <button className="btn-primary btn-block">
                    Open Editor
                  </button>
                </div>
              ))}
            </div>

            <div className="add-more">
              <UploadArea onUpload={handleFileUpload} onUrlUpload={handleUrlUpload} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
