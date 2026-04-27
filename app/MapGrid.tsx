import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface GridProps {
  showGrid: boolean;
  gridSize: number;
  mapWidth: number;
  mapHeight: number;
}

const MapGrid = ({ showGrid, gridSize, mapWidth, mapHeight }: GridProps) => {
  const [selectedCell, setSelectedCell] = useState<{ col: string; row: number } | null>(null);
  const selectionX = useSharedValue(0);
  const selectionY = useSharedValue(0);
  const selectionOpacity = useSharedValue(0);

  const cellWidth = mapWidth / gridSize;
  const cellHeight = mapHeight / gridSize;

  const tap = Gesture.Tap()
    .maxDuration(250)
    .onEnd((e) => {
      'worklet';
      if (!showGrid) return;

      const colIdx = Math.floor(e.x / cellWidth);
      const rowIdx = Math.floor(e.y / cellHeight);

      if (colIdx >= 0 && colIdx < gridSize && rowIdx >= 0 && rowIdx < gridSize) {
        selectionX.value = colIdx * cellWidth;
        selectionY.value = rowIdx * cellHeight;
        selectionOpacity.value = withTiming(1);

        runOnJS(setSelectedCell)({
          col: String.fromCharCode(65 + colIdx),
          row: gridSize - rowIdx,
        });
      }
    });

  const animatedSelection = useAnimatedStyle(() => ({
    width: cellWidth,
    height: cellHeight,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
    opacity: selectionOpacity.value,
    transform: [{ translateX: selectionX.value }, { translateY: selectionY.value }],
  }));

  if (!showGrid) return null;

  // Build vertical lines (columns) and horizontal lines (rows)
  const verticalLines = Array.from({ length: gridSize - 1 }, (_, i) => (
    <View
      key={`v-${i}`}
      style={{
        position: 'absolute',
        left: cellWidth * (i + 1),
        top: 0,
        width: 1,
        height: mapHeight,
        backgroundColor: 'rgba(0, 255, 0, 0.4)',
      }}
    />
  ));

  const horizontalLines = Array.from({ length: gridSize - 1 }, (_, i) => (
    <View
      key={`h-${i}`}
      style={{
        position: 'absolute',
        top: cellHeight * (i + 1),
        left: 0,
        height: 1,
        width: mapWidth,
        backgroundColor: 'rgba(0, 255, 0, 0.4)',
      }}
    />
  ));

  // Column labels (A, B, C…) along the top
  const colLabels = Array.from({ length: gridSize }, (_, i) => (
    <View
      key={`col-label-${i}`}
      style={{
        position: 'absolute',
        left: cellWidth * i,
        top: 4,
        width: cellWidth,
        alignItems: 'center',
      }}
    >
      <Text style={styles.gridLabel}>{String.fromCharCode(65 + i)}</Text>
    </View>
  ));

  // Row labels (12, 11, 10… 1) along the left
  const rowLabels = Array.from({ length: gridSize }, (_, i) => (
    <View
      key={`row-label-${i}`}
      style={{
        position: 'absolute',
        top: cellHeight * i,
        left: 4,
        height: cellHeight,
        justifyContent: 'center',
      }}
    >
      <Text style={styles.gridLabel}>{gridSize - i}</Text>
    </View>
  ));

  return (
    <GestureDetector gesture={tap}>
      <View style={StyleSheet.absoluteFill}>
        {verticalLines}
        {horizontalLines}
        {colLabels}
        {rowLabels}
        <Animated.View style={animatedSelection} />

        {selectedCell && (
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>
              {selectedCell.col}{selectedCell.row}
            </Text>
          </View>
        )}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  labelText: { color: '#00FF00', fontSize: 18, fontWeight: 'bold' },
  gridLabel: {
    color: 'rgba(0, 255, 0, 0.8)',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MapGrid;