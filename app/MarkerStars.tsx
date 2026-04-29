import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MarkerStarsProps {
  /** Number of filled stars (0–3). 0 means not yet beaten — stars are hidden. */
  stars: 0 | 1 | 2 | 3;
  /** Pixel position of the marker's center on the map */
  centerX: number;
  centerY: number;
  /** The rendered size of the marker image, used to position stars below it */
  markerSize: number;
}

const TOTAL_STARS  = 3;
const STAR_SIZE    = 14;
const STAR_GAP     = 2;
const ROW_WIDTH    = TOTAL_STARS * STAR_SIZE + (TOTAL_STARS - 1) * STAR_GAP;
const STAR_FILLED  = '★';
const STAR_EMPTY   = '☆';

const MarkerStars = ({ stars, centerX, centerY, markerSize }: MarkerStarsProps) => {
  if (stars === 0) return null;

  const left = centerX - ROW_WIDTH / 2;
  const top  = centerY + markerSize / 2 + 6;

  return (
    <View pointerEvents="none" style={[styles.row, { left, top }]}>
      {Array.from({ length: TOTAL_STARS }, (_, i) => {
        const filled = i < stars;
        return (
          <Text key={i} style={[styles.star, filled ? styles.starFilled : styles.starEmpty]}>
            {filled ? STAR_FILLED : STAR_EMPTY}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    flexDirection: 'row',
    gap: STAR_GAP,
  },
  star: {
    fontSize: STAR_SIZE,
    lineHeight: STAR_SIZE + 2,
  },
  starFilled: {
    color: '#FFD232',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  starEmpty: {
    color: 'rgba(255, 210, 50, 0.4)',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default MarkerStars;