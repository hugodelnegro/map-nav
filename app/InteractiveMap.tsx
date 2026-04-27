import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withSpring,
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';

interface MapProps {
  source: any;
  gridSize?: number;
  mapWidth: number;
  mapHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  showGrid?: boolean;
}

const MAX_SCALE = 4;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

const InteractiveMap = ({
  source,
  gridSize = 12,
  mapWidth,
  mapHeight,
  viewportWidth,
  viewportHeight,
  showGrid = true,
}: MapProps) => {
  const minScale = Math.max(viewportWidth / mapWidth, viewportHeight / mapHeight);
  const initialScale = Math.max(1.8, minScale);
  const initialTranslateX = 0;
  const initialTranslateY = viewportHeight - mapHeight * initialScale;
  const [selectedCell, setSelectedCell] = useState<{ col: string; row: number } | null>(null);
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const translateX = useSharedValue(initialTranslateX);
  const translateY = useSharedValue(initialTranslateY);
  const savedTranslationX = useSharedValue(initialTranslateX);
  const savedTranslationY = useSharedValue(initialTranslateY);
  const selectionOpacity = useSharedValue(0);
  const selectionScale = useSharedValue(0.8);
  const selectionX = useSharedValue(0);
  const selectionY = useSharedValue(0);

  const cellWidth = mapWidth / gridSize;
  const cellHeight = mapHeight / gridSize;

  const updateSelectedCell = (col: string, row: number) => {
    setSelectedCell({ col, row });
  };

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .maxDistance(12)
    .onEnd((e, success) => {
    if (!success) {
      return;
    }

    const imageX = (e.x - translateX.value) / scale.value;
    const imageY = (e.y - translateY.value) / scale.value;
    const colIdx = Math.floor((imageX / mapWidth) * gridSize);
    const rowIdx = Math.floor((imageY / mapHeight) * gridSize);
    
    if (colIdx >= 0 && colIdx < gridSize && rowIdx >= 0 && rowIdx < gridSize) {
      selectionX.value = colIdx * cellWidth;
      selectionY.value = rowIdx * cellHeight;
      selectionOpacity.value = withTiming(1, { duration: 100 });
      selectionScale.value = withSequence(withSpring(1.2), withSpring(1));
      runOnJS(updateSelectedCell)(String.fromCharCode(65 + colIdx), rowIdx + 1);
    }
  });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const nextScale = clamp(savedScale.value * e.scale, minScale, MAX_SCALE);
      const minTranslateX = viewportWidth - mapWidth * nextScale;
      const minTranslateY = viewportHeight - mapHeight * nextScale;

      scale.value = nextScale;
      translateX.value = clamp(savedTranslationX.value, minTranslateX, 0);
      translateY.value = clamp(savedTranslationY.value, minTranslateY, 0);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslationX.value = translateX.value;
      savedTranslationY.value = translateY.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const minTranslateX = viewportWidth - mapWidth * scale.value;
      const minTranslateY = viewportHeight - mapHeight * scale.value;

      translateX.value = clamp(savedTranslationX.value + e.translationX, minTranslateX, 0);
      translateY.value = clamp(savedTranslationY.value + e.translationY, minTranslateY, 0);
    })
    .onEnd(() => {
      savedTranslationX.value = translateX.value;
      savedTranslationY.value = translateY.value;
    });

  const animatedSelectionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: selectionX.value },
      { translateY: selectionY.value },
      { scale: selectionScale.value }
    ],
    opacity: selectionOpacity.value,
  }));

  const translateStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
  }));

  const cells = Array.from({ length: gridSize });
  const navigationGesture = Gesture.Simultaneous(panGesture, pinchGesture);
  const mapGesture = Gesture.Race(navigationGesture, tapGesture);

  return (
    <View className="flex-1 overflow-hidden">
      <GestureDetector gesture={mapGesture}>
        <Animated.View style={[{ width: mapWidth, height: mapHeight }, translateStyle]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transformOrigin: 'top left',
              },
              scaleStyle,
            ]}
          >
            <Image source={source} style={StyleSheet.absoluteFill} resizeMode="stretch" />

            {showGrid && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {cells.map((_, i) => (
                  <React.Fragment key={i}>
                    <View className="absolute h-full border-r border-white/20" style={{ left: `${(i / gridSize) * 100}%`, width: 1 }} />
                    <View className="absolute w-full border-b border-white/20" style={{ top: `${(i / gridSize) * 100}%`, height: 1 }} />
                  </React.Fragment>
                ))}
                {cells.map((_, i) => (
                  <React.Fragment key={`label-${i}`}>
                    <Text className="absolute text-[10px] text-white/50 font-mono" style={{ left: `${(i / gridSize) * 100}%`, top: 4, marginLeft: 4 }}>
                      {String.fromCharCode(65 + i)}
                    </Text>
                    <Text className="absolute text-[10px] text-white/50 font-mono" style={{ top: `${(i / gridSize) * 100}%`, left: 4, marginTop: 4 }}>
                      {i + 1}
                    </Text>
                  </React.Fragment>
                ))}
              </View>
            )}

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: cellWidth,
                  height: cellHeight,
                  borderWidth: 3,
                  borderColor: '#22c55e',
                  backgroundColor: 'rgba(34, 197, 94, 0.25)',
                  zIndex: 20,
                },
                animatedSelectionStyle,
              ]}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      {selectedCell && (
        <View
          className="absolute bottom-6 rounded-full bg-black/75 px-4 py-2"
          style={{ left: '50%', transform: [{ translateX: -40 }] }}
        >
          <Text className="text-sm font-mono text-white">
            {selectedCell.col}-{selectedCell.row}
          </Text>
        </View>
      )}
    </View>
  );
};

export default InteractiveMap;
