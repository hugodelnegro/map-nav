import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MarkerLevelProps {
  level: number;
  centerX: number;
  centerY: number;
  markerSize: number;
  opacity?: number;
}

const MarkerLevel = ({ level, centerX, centerY, markerSize, opacity = 1 }: MarkerLevelProps) => {
  const left = centerX - markerSize / 2 + 8;
  const top  = centerY + markerSize / 2 - 4;

  return (
    <View pointerEvents="none" style={[styles.badge, { left, top, opacity }]}>
      <Text style={styles.label}>Lv {level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    paddingHorizontal: 4,
    paddingVertical: 0,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  label: {
    color: 'rgba(250, 252, 192, 1)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});

export default MarkerLevel;
