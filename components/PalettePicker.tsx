import { useState } from 'react';

interface PalettePickerProps {
  onApplyPalette: (palette: any) => void;
}

const PRESET_PALETTES = [
  {
    name: 'Sunset',
    colors: { primary: '#FF6B6B', secondary: '#FFD93D', accent: '#6BCF7F' },
  },
  {
    name: 'Ocean',
    colors: { primary: '#4ECDC4', secondary: '#44A8E0', accent: '#1A535C' },
  },
  {
    name: 'Forest',
    colors: { primary: '#2D6A4F', secondary: '#52B788', accent: '#95D5B2' },
  },
  {
    name: 'Purple Dream',
    colors: { primary: '#9D4EDD', secondary: '#C77DFF', accent: '#E0AAFF' },
  },
  {
    name: 'Fire',
    colors: { primary: '#FF0000', secondary: '#FF8800', accent: '#FFDD00' },
  },
];

export default function PalettePicker({ onApplyPalette }: PalettePickerProps) {
  const [customPalette, setCustomPalette] = useState({
    primary: '#FF0000',
    secondary: '#00FF00',
    accent: '#0000FF',
  });

  const handleColorChange = (key: string, value: string) => {
    setCustomPalette({ ...customPalette, [key]: value });
  };

  const applyCustomPalette = () => {
    onApplyPalette(customPalette);
  };

  const applyPresetPalette = (palette: any) => {
    onApplyPalette(palette.colors);
    setCustomPalette(palette.colors);
  };

  return (
    <div className="palette-picker">
      <div className="panel-header">
        <h3>Color Palettes</h3>
      </div>

      {/* Presets Section */}
      <div className="preset-palettes">
        <h4>Presets</h4>
        <div className="preset-list">
          {PRESET_PALETTES.map((palette, index) => (
            <div
              key={index}
              className="palette-preset hover-scale"
              onClick={() => applyPresetPalette(palette)}
            >
              <span className="palette-name">{palette.name}</span>
              <div className="palette-colors">
                {Object.values(palette.colors).map((color, i) => (
                  <div
                    key={i}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Palette Section */}
      <div className="custom-palette">
        <h4>Custom Palette</h4>

        {Object.entries(customPalette).map(([key, value]) => (
          <div key={key} className="property-group">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <div className="color-input-group">
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="color-picker hover-scale"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="color-text"
              />
            </div>
          </div>
        ))}

        <button onClick={applyCustomPalette} className="btn-primary btn-block hover-scale">
          Apply Custom Palette
        </button>
      </div>

      {/* Styles */}
      <style jsx>{`
        .palette-picker {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          width: 350px;
          font-family: 'Inter', sans-serif;
        }

        .panel-header h3 {
          margin: 0;
        }

        h4 {
          margin-bottom: 8px;
        }

        .preset-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .palette-preset {
          display: flex;
          flex-direction: column;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          background: #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .palette-preset:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .palette-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .palette-colors {
          display: flex;
          gap: 4px;
        }

        .color-swatch {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #ccc;
          transition: transform 0.2s;
        }

        .color-swatch:hover {
          transform: scale(1.2);
        }

        .custom-palette {
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

        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
