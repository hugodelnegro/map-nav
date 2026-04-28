import React from 'react';
import { Pressable, Text } from 'react-native';

interface GridToggleButtonProps {
  showGrid: boolean;
  onToggle: () => void;
}

const GridToggleButton = ({ showGrid, onToggle }: GridToggleButtonProps) => (
  <Pressable
    onPress={onToggle}
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
);

export default GridToggleButton;
