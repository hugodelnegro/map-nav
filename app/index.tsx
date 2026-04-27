import React, { useState } from 'react';
import { Pressable, Text, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// NO curly braces for default export
import InteractiveMap from './InteractiveMap'; 
import MapImage from '../assets/images/map.png';

const MAP_IMAGE_WIDTH = 1254;
const MAP_IMAGE_HEIGHT = 1254;

export default function MapScreen() {
  const { width, height } = useWindowDimensions();
  const mapWidth = MAP_IMAGE_WIDTH;
  const mapHeight = MAP_IMAGE_HEIGHT;
  const [showGrid, setShowGrid] = useState(false);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1 bg-black">
        <StatusBar hidden />
        <InteractiveMap
          source={MapImage}
          gridSize={60}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          viewportWidth={width}
          viewportHeight={height}
          showGrid={showGrid}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowGrid((current) => !current)}
          className="absolute right-4 top-16 rounded-full border border-white/20 bg-black/70 px-4 py-2"
        >
          <Text className="text-xs font-mono uppercase tracking-widest text-white">
            Grid {showGrid ? 'On' : 'Off'}
          </Text>
        </Pressable>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
