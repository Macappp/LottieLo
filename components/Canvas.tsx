import { useEffect, useRef, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface CanvasProps {
  animationData: any;
  onFrameChange?: (frame: number) => void;
}

export default function Canvas({ animationData, onFrameChange }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    if (!animationData) {
      setError('No animation data provided');
      return;
    }

    if (!animationData.layers || !Array.isArray(animationData.layers)) {
      setError('Invalid animation data: missing layers');
      return;
    }

    try {
      if (animationRef.current) {
        animationRef.current.destroy();
      }

      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: animationData,
      });

      setTotalFrames(animationRef.current.totalFrames);
      setCurrentFrame(0);
      setError(null);

      animationRef.current.addEventListener('enterFrame', () => {
        if (animationRef.current) {
          const frame = Math.floor(animationRef.current.currentFrame);
          setCurrentFrame(frame);
          onFrameChange?.(frame);
        }
      });
    } catch (err: any) {
      console.error('Error loading animation:', err);
      setError(err.message || 'Failed to load animation');
    }

    return () => {
      animationRef.current?.destroy();
    };
  }, [animationData, onFrameChange]);

  const togglePlay = () => {
    if (animationRef.current) {
      if (isPlaying) {
        animationRef.current.pause();
      } else {
        animationRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFrameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value);
    setCurrentFrame(frame);
    animationRef.current?.goToAndStop(frame, true);
    onFrameChange?.(frame);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  if (error) {
    return (
      <div className="canvas-container">
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#dc3545',
          background: '#f8d7da',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          <h3>Error Loading Animation</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-container">
      <div className="canvas-toolbar">
        <button onClick={togglePlay} className="btn-icon">
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="frame-slider">
          <input
            type="range"
            min="0"
            max={totalFrames}
            value={currentFrame}
            onChange={handleFrameChange}
          />
          <span className="frame-counter">
            {currentFrame} / {Math.floor(totalFrames)}
          </span>
        </div>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`btn-icon ${showGrid ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>

        <div className="zoom-controls">
          <button onClick={() => handleZoomChange(Math.max(25, zoom - 25))} className="btn-icon">-</button>
          <span>{zoom}%</span>
          <button onClick={() => handleZoomChange(Math.min(200, zoom + 25))} className="btn-icon">+</button>
        </div>
      </div>

      <div className="canvas-viewport" style={{ position: 'relative' }}>
        {showGrid && <div className="grid-overlay"></div>}
        <div
          ref={containerRef}
          className="lottie-container"
          style={{ transform: `scale(${zoom / 100})` }}
        />
      </div>
    </div>
  );
}
