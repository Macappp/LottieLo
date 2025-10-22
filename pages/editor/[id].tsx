import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Canvas from '../../components/Canvas';
import LayerPanel from '../../components/LayerPanel';
import PalettePicker from '../../components/PalettePicker';

export default function Editor() {
  const router = useRouter();
  const { id } = router.query;
  const [animationData, setAnimationData] = useState<any>(null);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'layers' | 'palette'>('layers');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAnimation();
    }
  }, [id]);

  const loadAnimation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/file/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Animation not found. It may have expired or been deleted.');
        } else if (response.status === 401) {
          setError('Session expired. Please upload your file again.');
        } else {
          setError('Failed to load animation. Please try again.');
        }
        return;
      }
      
      const data = await response.json();
      
      if (!data || !data.layers) {
        setError('Invalid animation data received.');
        return;
      }
      
      setAnimationData(data);
    } catch (error) {
      console.error('Failed to load animation:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLayerSelect = (layers: string[]) => {
    setSelectedLayers(layers);
  };

  const handlePropertyChange = async (properties: any) => {
    try {
      const response = await fetch(`/api/file/${id}/edit-layer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layers: selectedLayers,
          properties,
        }),
      });

      if (response.ok) {
        await loadAnimation();
      } else {
        alert('Failed to update properties. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update properties:', error);
      alert('Failed to update properties. Please try again.');
    }
  };

  const handleApplyPalette = async (palette: any) => {
    try {
      const response = await fetch(`/api/file/${id}/apply-palette`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          palette,
          layers: selectedLayers.length > 0 ? selectedLayers : ['all'],
        }),
      });

      if (response.ok) {
        await loadAnimation();
      } else {
        alert('Failed to apply palette. Please try again.');
      }
    } catch (error) {
      console.error('Failed to apply palette:', error);
      alert('Failed to apply palette. Please try again.');
    }
  };

  const handleOptimize = async () => {
    if (!confirm('This will optimize your animation. Continue?')) return;

    try {
      const response = await fetch(`/api/file/${id}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const stats = await response.json();
        alert(`Optimized! Size reduced by ${stats.reductionPercent}%`);
        await loadAnimation();
      } else {
        alert('Failed to optimize. Please try again.');
      }
    } catch (error) {
      console.error('Failed to optimize:', error);
      alert('Failed to optimize. Please try again.');
    }
  };

  const handleExport = () => {
    window.location.href = `/api/file/${id}/export`;
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading animation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div style={{ 
          textAlign: 'center',
          maxWidth: '500px',
          padding: '2rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Error</h2>
          <p style={{ marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={() => router.push('/')} 
            className="btn-primary"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <Head>
        <title>Lottie Editor - Edit Animation</title>
      </Head>

      <header className="editor-header">
        <button onClick={() => router.push('/')} className="btn-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="editor-title">Animation Editor</h1>

        <div className="editor-actions">
          <button onClick={handleOptimize} className="btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Optimize
          </button>
          <button onClick={handleExport} className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </header>

      <div className="editor-workspace">
        <aside className="editor-sidebar">
          <div className="sidebar-tabs">
            <button
              className={`tab ${activeTab === 'layers' ? 'active' : ''}`}
              onClick={() => setActiveTab('layers')}
            >
              Layers
            </button>
            <button
              className={`tab ${activeTab === 'palette' ? 'active' : ''}`}
              onClick={() => setActiveTab('palette')}
            >
              Palette
            </button>
          </div>

          <div className="sidebar-content">
            {activeTab === 'layers' && (
              <LayerPanel
                animationData={animationData}
                onLayerSelect={handleLayerSelect}
                onPropertyChange={handlePropertyChange}
              />
            )}
            {activeTab === 'palette' && (
              <PalettePicker onApplyPalette={handleApplyPalette} />
            )}
          </div>
        </aside>

        <main className="editor-canvas-area">
          {animationData && <Canvas animationData={animationData} />}
        </main>
      </div>
    </div>
  );
}
