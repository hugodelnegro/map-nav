import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import markers from '../data/makers';
import InteractiveMap from './InteractiveMap';
import MapGrid from './MapGrid';
import MapMarker, { GridConfig } from './MapMarker';

const MAP_IMAGE_WIDTH = 1254;
const MAP_IMAGE_HEIGHT = 1254;

export const GRID_CONFIG: GridConfig = {
  gridSize: 60,
  mapWidth: MAP_IMAGE_WIDTH,
  mapHeight: MAP_IMAGE_HEIGHT,
};

export default function MapScreen() {
  const { width, height } = useWindowDimensions();
  const [showGrid, setShowGrid] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar hidden />

        <InteractiveMap
          source={require('../assets/images/map.png')}
          mapWidth={MAP_IMAGE_WIDTH}
          mapHeight={MAP_IMAGE_HEIGHT}
          viewportWidth={width}
          viewportHeight={height}
        >
          <MapGrid
            showGrid={showGrid}
            gridSize={GRID_CONFIG.gridSize}
            mapWidth={MAP_IMAGE_WIDTH}
            mapHeight={MAP_IMAGE_HEIGHT}
          />

          {markers.map((marker) => (
            <MapMarker
              key={marker.id}
              cell={marker.cell}
              source={marker.source}
              config={GRID_CONFIG}
              scale={marker.scale}
            />
          ))}
        </InteractiveMap>

        <Pressable
          onPress={() => setShowGrid((prev) => !prev)}
          style={{
            position: 'absolute',
            right: 20,
            top: 60,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#00FF00',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            GRID: {showGrid ? 'ON' : 'OFF'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}