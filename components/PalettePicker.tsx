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

      <div className="preset-palettes">
        <h4>Presets</h4>
        {PRESET_PALETTES.map((palette, index) => (
          <div
            key={index}
            className="palette-preset"
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

        <button onClick={applyCustomPalette} className="btn-primary btn-block">
          Apply Custom Palette
        </button>
      </div>
    </div>
  );
}
