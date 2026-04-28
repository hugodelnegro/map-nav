import React from 'react';
import { Image, ImageSourcePropType, Pressable, View } from 'react-native';

export interface GridConfig {
  gridSize: number;
  mapWidth: number;
  mapHeight: number;
}

export interface CellCoord {
  col: string; // e.g. "G", "AA"
  row: number; // 1 = bottom row
}

/** Convert a column label (A, B, … Z, AA, AB…) to a 0-based index */
const colLabelToIndex = (col: string): number => {
  const upper = col.toUpperCase();
  let index = 0;
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
};

/** Get pixel rect for a cell coordinate */
const cellToPixelRect = (cell: CellCoord, config: GridConfig) => {
  const cellWidth = config.mapWidth / config.gridSize;
  const cellHeight = config.mapHeight / config.gridSize;
  const colIdx = colLabelToIndex(cell.col);
  const rowIdx = config.gridSize - cell.row;
  const x = colIdx * cellWidth;
  const y = rowIdx * cellHeight;
  return {
    x,
    y,
    width: cellWidth,
    height: cellHeight,
    centerX: x + cellWidth / 2,
    centerY: y + cellHeight / 2,
  };
};

interface MapMarkerProps {
  cell: CellCoord;
  source: ImageSourcePropType;
  config: GridConfig;
  /** Fraction of cell size to render the image. Default 2 */
  scale?: number;
  onPress?: () => void;
}

const MapMarker = ({ cell, source, config, scale = 2, onPress }: MapMarkerProps) => {
  const rect = cellToPixelRect(cell, config);
  const imageSize = Math.min(rect.width, rect.height) * scale;
  const offsetX = rect.centerX - imageSize / 2;
  const offsetY = rect.centerY - imageSize / 2;

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        left: offsetX,
        top: offsetY,
        width: imageSize,
        height: imageSize,
      }}
    >
      <Image
        source={source}
        style={{ width: imageSize, height: imageSize }}
        resizeMode="contain"
      />
    </Pressable>
  );
};

export default MapMarker;