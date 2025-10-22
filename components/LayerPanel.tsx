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
      <div className="panel-header">
        <h3>Layers</h3>
        <button onClick={selectAllLayers} className="btn-small">
          Select All
        </button>
      </div>

      <div className="layer-list">
        {layers.map((layer, index) => (
          <div
            key={index}
            className={`layer-item ${selectedLayers.includes(layer.nm) || selectedLayers.includes('all') ? 'selected' : ''}`}
            onClick={(e) => toggleLayerSelection(layer.nm, e.ctrlKey || e.metaKey)}
          >
            <span className="layer-icon">
              {layer.ty === 4 ? '◆' : layer.ty === 0 ? '📦' : '●'}
            </span>
            <span className="layer-name">{layer.nm || `Layer ${index + 1}`}</span>
          </div>
        ))}
      </div>

      <div className="layer-properties">
        <h4>Properties</h4>
        
        <div className="property-group">
          <label>Fill Color</label>
          <div className="color-input-group">
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
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
          <label>Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
          />
          <span>{(opacity * 100).toFixed(0)}%</span>
        </div>

        <button onClick={handleApplyProperties} className="btn-primary btn-block">
          Apply Properties
        </button>
      </div>
    </div>
  );
}
