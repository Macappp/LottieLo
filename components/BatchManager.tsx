import { useState } from 'react';

interface FileMetadata {
  id: string;
  name: string;
  frames: number;
  width: number;
  height: number;
  frameRate: number;
}

interface BatchManagerProps {
  files: FileMetadata[];
  onBatchOperation: (operation: string, fileIds: string[], palette?: any) => Promise<any>;
}

export default function BatchManager({ files, onBatchOperation }: BatchManagerProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [operation, setOperation] = useState<'optimize' | 'applyPalette'>('optimize');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [palette, setPalette] = useState({
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFD93D',
  });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAll = () => {
    setSelectedFiles(files.map(f => f.id));
  };

  const deselectAll = () => {
    setSelectedFiles([]);
  };

  const handleBatchProcess = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setResults([]);

    try {
      const batchResults = await onBatchOperation(
        operation,
        selectedFiles,
        operation === 'applyPalette' ? palette : undefined
      );
      setResults(batchResults);
    } catch (error) {
      console.error('Batch processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="batch-manager">
      <div className="panel-header">
        <h3>Batch Operations</h3>
      </div>

      <div className="batch-controls">
        <div className="file-selection">
          <div className="selection-actions">
            <button onClick={selectAll} className="btn-small">Select All</button>
            <button onClick={deselectAll} className="btn-small">Deselect All</button>
            <span className="selection-count">{selectedFiles.length} selected</span>
          </div>

          <div className="file-list">
            {files.map(file => (
              <div
                key={file.id}
                className={`file-item ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => {}}
                />
                <span className="file-name">{file.name}</span>
                <span className="file-info">{file.width}×{file.height}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="operation-selector">
          <label>Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as 'optimize' | 'applyPalette')}
            className="select-input"
          >
            <option value="optimize">Optimize</option>
            <option value="applyPalette">Apply Palette</option>
          </select>
        </div>

        {operation === 'applyPalette' && (
          <div className="palette-config">
            <h4>Palette Colors</h4>
            {Object.entries(palette).map(([key, value]) => (
              <div key={key} className="property-group">
                <label>{key}</label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => setPalette({ ...palette, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleBatchProcess}
          disabled={selectedFiles.length === 0 || isProcessing}
          className="btn-primary btn-block"
        >
          {isProcessing ? 'Processing...' : `Process ${selectedFiles.length} Files`}
        </button>
      </div>

      {results.length > 0 && (
        <div className="batch-results">
          <h4>Results</h4>
          {results.map((result, index) => (
            <div key={index} className={`result-item ${result.status}`}>
              <span className="result-file">{result.fileId.substring(0, 8)}</span>
              {result.status === 'success' ? (
                <span className="result-message">
                  {operation === 'optimize' 
                    ? `Reduced by ${result.reductionPercent}%` 
                    : 'Palette applied'}
                </span>
              ) : (
                <span className="result-error">{result.message}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
