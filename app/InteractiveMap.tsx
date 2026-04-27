import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface MapProps {
  source: any;
  mapWidth: number;
  mapHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  children?: React.ReactNode;
}

const InteractiveMap = ({
  source,
  mapWidth,
  mapHeight,
  viewportWidth,
  viewportHeight,
  children,
}: MapProps) => {
  const zoomMultiplier = 2;

  const baseScale = viewportHeight / mapHeight;
  const initialScale = baseScale * zoomMultiplier;
  const minScale = baseScale;
  const maxScale = baseScale * 4;

  // All values the worklet needs must be captured as plain numbers (not shared values)
  // so they are inlined into the worklet closure at creation time.
  const _mapWidth = mapWidth;
  const _mapHeight = mapHeight;
  const _viewportWidth = viewportWidth;
  const _viewportHeight = viewportHeight;

  /**
   * Returns pan bounds for a given scale.
   * MUST be a worklet — it is called from gesture handlers on the UI thread.
   *
   * The map is transformed with:
   *   translateX / translateY  (applied in map-space, before scale in the transform array)
   *   scale
   *
   * Because we apply translate BEFORE scale in the transform array, the translation
   * values are in *map coordinates*, not screen coordinates. The clamping below keeps
   * the scaled map inside the viewport.
   */
  const getBounds = (currentScale: number) => {
    'worklet';
    const scaledWidth = _mapWidth * currentScale;
    const scaledHeight = _mapHeight * currentScale;

    // How far the map can move horizontally so it never leaves the viewport
    const overflowX = Math.max(scaledWidth - _viewportWidth, 0);
    const overflowY = Math.max(scaledHeight - _viewportHeight, 0);

    // In pre-scale translate space the displacement that corresponds to
    // one screen pixel is (1 / currentScale) map pixels.
    const halfOverflowX = overflowX / 2 / currentScale;
    const halfOverflowY = overflowY / 2 / currentScale;

    return {
      minX: -halfOverflowX,
      maxX: halfOverflowX,
      minY: -halfOverflowY,
      maxY: halfOverflowY,
    };
  };

  const clamp = (value: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(value, min), max);
  };

  // Shared values — all in *map-space* (pre-scale) coordinates
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);

  // Start at left-bottom: pan as far left and as far down as bounds allow
  const initialBounds = (() => {
    const scaledWidth = mapWidth * initialScale;
    const scaledHeight = mapHeight * initialScale;
    const overflowX = Math.max(scaledWidth - viewportWidth, 0);
    const overflowY = Math.max(scaledHeight - viewportHeight, 0);
    const halfOverflowX = overflowX / 2 / initialScale;
    const halfOverflowY = overflowY / 2 / initialScale;
    return { minX: -halfOverflowX, maxX: halfOverflowX, minY: -halfOverflowY, maxY: halfOverflowY };
  })();

  const translationX = useSharedValue(initialBounds.maxX); // left edge
  const translationY = useSharedValue(initialBounds.minY); // bottom edge
  const savedTranslationX = useSharedValue(initialBounds.maxX);
  const savedTranslationY = useSharedValue(initialBounds.minY);

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      'worklet';
      const bounds = getBounds(scale.value);
      // e.translationX/Y are in screen pixels; convert to map-space
      translationX.value = clamp(
        savedTranslationX.value + e.translationX / scale.value,
        bounds.minX,
        bounds.maxX,
      );
      translationY.value = clamp(
        savedTranslationY.value + e.translationY / scale.value,
        bounds.minY,
        bounds.maxY,
      );
    })
    .onEnd(() => {
      'worklet';
      savedTranslationX.value = translationX.value;
      savedTranslationY.value = translationY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      'worklet';
      const nextScale = clamp(savedScale.value * e.scale, minScale, maxScale);
      const bounds = getBounds(nextScale);

      scale.value = nextScale;
      translationX.value = clamp(translationX.value, bounds.minX, bounds.maxX);
      translationY.value = clamp(translationY.value, bounds.minY, bounds.maxY);
    })
    .onEnd(() => {
      'worklet';
      savedScale.value = scale.value;
      savedTranslationX.value = translationX.value;
      savedTranslationY.value = translationY.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: _mapWidth,
    height: _mapHeight,
    transform: [
      // Centre the map in the viewport first, then apply user pan, then scale.
      // Keeping translateX/Y in map-space (pre-scale) means the math above is simpler.
      { translateX: (_viewportWidth - _mapWidth) / 2 + translationX.value * scale.value },
      { translateY: (_viewportHeight - _mapHeight) / 2 + translationY.value * scale.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View
      style={[
        styles.container,
        { width: viewportWidth, height: viewportHeight },
      ]}
    >
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
        <Animated.View style={animatedStyle}>
          <Image
            source={source}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
});

export default InteractiveMap;