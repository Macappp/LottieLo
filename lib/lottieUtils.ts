export function extractMetadata(lottieData: any) {
  return {
    frames: lottieData.op - lottieData.ip,
    width: lottieData.w,
    height: lottieData.h,
    frameRate: lottieData.fr,
    layerCount: lottieData.layers?.length || 0,
  };
}

export function updateLayerProperties(
  lottieData: any,
  layerIds: string[],
  properties: any
): any {
  const updatedData = JSON.parse(JSON.stringify(lottieData));

  function updateLayer(layer: any) {
    if (layerIds.includes(layer.nm) || layerIds.includes('all')) {
      if (properties.fillColor && layer.shapes) {
        updateShapeColors(layer.shapes, properties.fillColor, 'fill');
      }
      if (properties.strokeColor && layer.shapes) {
        updateShapeColors(layer.shapes, properties.strokeColor, 'stroke');
      }
      if (properties.opacity !== undefined) {
        if (!layer.ks) layer.ks = {};
        layer.ks.o = { a: 0, k: properties.opacity * 100 };
      }
    }

    if (layer.layers) {
      layer.layers.forEach(updateLayer);
    }
  }

  function updateShapeColors(shapes: any[], color: string, type: 'fill' | 'stroke') {
    shapes.forEach((shape: any) => {
      if (shape.ty === 'fl' && type === 'fill') {
        const rgb = hexToRgb(color);
        shape.c.k = [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1];
      } else if (shape.ty === 'st' && type === 'stroke') {
        const rgb = hexToRgb(color);
        shape.c.k = [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1];
      } else if (shape.it) {
        updateShapeColors(shape.it, color, type);
      }
    });
  }

  updatedData.layers.forEach(updateLayer);
  return updatedData;
}

export function applyPalette(lottieData: any, palette: any, layers: string[] = ['all']): any {
  const updatedData = JSON.parse(JSON.stringify(lottieData));
  const colors = Object.values(palette);
  let colorIndex = 0;

  function updateLayer(layer: any) {
    if (layers.includes(layer.nm) || layers.includes('all')) {
      if (layer.shapes) {
        updateShapesWithPalette(layer.shapes, colors, colorIndex);
        colorIndex = (colorIndex + 1) % colors.length;
      }
    }

    if (layer.layers) {
      layer.layers.forEach(updateLayer);
    }
  }

  function updateShapesWithPalette(shapes: any[], paletteColors: any[], index: number) {
    shapes.forEach((shape: any) => {
      if (shape.ty === 'fl') {
        const color = paletteColors[index % paletteColors.length];
        const rgb = hexToRgb(color);
        shape.c.k = [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1];
      } else if (shape.it) {
        updateShapesWithPalette(shape.it, paletteColors, index);
      }
    });
  }

  updatedData.layers.forEach(updateLayer);
  return updatedData;
}

export function optimizeLottie(lottieData: any): { data: any; stats: any } {
  const originalSize = JSON.stringify(lottieData).length;
  const optimizedData = JSON.parse(JSON.stringify(lottieData));

  function roundValue(value: any, precision: number = 2): any {
    if (typeof value === 'number') {
      return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    }
    if (Array.isArray(value)) {
      return value.map(v => roundValue(v, precision));
    }
    if (typeof value === 'object' && value !== null) {
      const rounded: any = {};
      for (const key in value) {
        rounded[key] = roundValue(value[key], precision);
      }
      return rounded;
    }
    return value;
  }

  function removeHiddenLayers(layers: any[]): any[] {
    return layers.filter(layer => {
      if (layer.hd) return false;
      if (layer.layers) {
        layer.layers = removeHiddenLayers(layer.layers);
      }
      return true;
    });
  }

  optimizedData.layers = removeHiddenLayers(optimizedData.layers);
  
  const layersBeforeCount = lottieData.layers?.length || 0;
  const layersAfterCount = optimizedData.layers?.length || 0;

  if (optimizedData.layers) {
    optimizedData.layers = optimizedData.layers.map((layer: any) => roundValue(layer, 2));
  }

  const optimizedSize = JSON.stringify(optimizedData).length;

  return {
    data: optimizedData,
    stats: {
      originalSize,
      optimizedSize,
      layersBefore: layersBeforeCount,
      layersAfter: layersAfterCount,
      reductionPercent: ((originalSize - optimizedSize) / originalSize * 100).toFixed(2),
    },
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}
