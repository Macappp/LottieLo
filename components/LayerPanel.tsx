import { useState, useEffect } from 'react';

interface Layer {
  nm: string;
  ty: number;
  ind?: number;
}

interface LayerPanelProps {
  animationData: any;
  onLayerSelect: (layers: string[]) => void;
  onPropertyChange: (properties: any) => void;
}

export default function LayerPanel({ animationData, onLayerSelect, onPropertyChange }: LayerPanelProps) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [fillColor, setFillColor] = useState('#FF0000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (animationData?.layers) {
      setLayers(animationData.layers);
    }
  }, [animationData]);

  const toggleLayerSelection = (layerName: string, ctrlKey: boolean) => {
    let newSelection: string[];

    if (ctrlKey) {
      newSelection = selectedLayers.includes(layerName)
        ? selectedLayers.filter(l => l !== layerName)
        : [...selectedLayers, layerName];
    } else {
      newSelection = [layerName];
    }

    setSelectedLayers(newSelection);
    onLayerSelect(newSelection);
  };

  const handleApplyProperties = () => {
    onPropertyChange({
      fillColor,
      strokeColor,
      opacity,
    });
  };

  const selectAllLayers = () => {
    setSelectedLayers(['all']);
    onLayerSelect(['all']);
  };

  return (
    <div className="layer-panel">
      {/* Header */}
      <div className="panel-header">
        <h3>Layers</h3>
        <button onClick={selectAllLayers} className="btn-small hover-scale">
          Select All
        </button>
      </div>

      {/* Layer List */}
      <div className="layer-list">
        {layers.map((layer, index) => {
          const isSelected = selectedLayers.includes(layer.nm) || selectedLayers.includes('all');
          return (
            <div
              key={index}
              className={`layer-item ${isSelected ? 'selected' : ''} hover-bg`}
              style={{ transitionDelay: `${index * 50}ms` }} // cascading effect
              onClick={(e) => toggleLayerSelection(layer.nm, e.ctrlKey || e.metaKey)}
            >
              <span className="layer-icon">
                {layer.ty === 4 ? '◆' : layer.ty === 0 ? '📦' : '●'}
              </span>
              <span className="layer-name">{layer.nm || `Layer ${index + 1}`}</span>
              {/* Animated checkmark */}
              <span className={`checkmark ${isSelected ? 'visible' : ''}`}>✔</span>
            </div>
          );
        })}
      </div>

      {/* Properties Panel */}
      <div className="layer-properties">
        <h4>Properties</h4>

        <div className="property-group">
          <label>Fill Color</label>
          <div className="color-input-group">
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="color-picker hover-scale"
            />
            <input
              type="text"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="color-text"
            />
          </div>
        </div>

        <div className="property-group">
          <label>Stroke Color</label>
          <div className="color-input-group">
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="color-picker hover-scale"
            />
            <input
              type="text"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="color-text"
            />
          </div>
        </div>

        <div className="property-group">
          <label>Opacity: <span>{(opacity * 100).toFixed(0)}%</span></label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="range-slider hover-scale"
          />
        </div>

        {/* Live preview box */}
        <div
          className="preview-box"
          style={{
            backgroundColor: fillColor,
            borderColor: strokeColor,
            opacity,
          }}
        >
          Preview
        </div>

        <button onClick={handleApplyProperties} className="btn-primary btn-block hover-scale">
          Apply Properties
        </button>
      </div>

      <style jsx>{`
        .layer-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          width: 320px;
          font-family: 'Inter', sans-serif;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-small {
          padding: 4px 8px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: #007bff;
          color: white;
          font-size: 0.85rem;
          transition: transform 0.2s;
        }

        .btn-primary {
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: #28a745;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          transition: transform 0.2s, background 0.2s;
        }

        .btn-block {
          width: 100%;
        }

        .layer-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .layer-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .layer-item.selected {
          background: #e2e6ea;
          font-weight: 500;
        }

        .layer-icon {
          font-size: 1.2rem;
        }

        .checkmark {
          font-size: 1rem;
          color: #28a745;
          opacity: 0;
          transform: scale(0.5);
          transition: opacity 0.3s, transform 0.3s;
        }

        .checkmark.visible {
          opacity: 1;
          transform: scale(1);
        }

        .layer-properties {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .property-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .color-input-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .color-text {
          flex: 1;
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .range-slider {
          width: 100%;
          cursor: pointer;
        }

        .preview-box {
          height: 50px;
          border: 2px solid #000;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          color: white;
          transition: all 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        .hover-bg:hover {
          background: #f1f3f5;
        }
      `}</style>
    </div>
  );
}
