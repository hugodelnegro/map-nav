import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InteractiveMap from './InteractiveMap';
import MapGrid from './MapGrid';
import CampaignLayer from './CampaignLayer';
import GridToggleButton from './GridToggleButton';
import { MAP_IMAGE_WIDTH, MAP_IMAGE_HEIGHT, GRID_CONFIG } from '../utils/mapConfig';

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
          <CampaignLayer />
        </InteractiveMap>

        <GridToggleButton
          showGrid={showGrid}
          onToggle={() => setShowGrid((prev) => !prev)}
        />
      </View>
    </SafeAreaProvider>
  );
}