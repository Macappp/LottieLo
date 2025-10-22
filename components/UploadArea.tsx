import { useState, useRef } from 'react';

interface UploadAreaProps {
  onUpload: (files: File[]) => void;
  onUrlUpload: (url: string) => void;
}

export default function UploadArea({ onUpload, onUrlUpload }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onUpload(files);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlUpload(url.trim());
      setUrl('');
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3>Drop Lottie files here</h3>
        <p>or click to browse (.json or .zip files)</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".json,.zip"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      <div className="divider">
        <span>OR</span>
      </div>

      <form onSubmit={handleUrlSubmit} className="url-form">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Lottie JSON URL"
          className="url-input"
        />
        <button type="submit" className="btn-primary">
          Load from URL
        </button>
      </form>
    </div>
  );
}
