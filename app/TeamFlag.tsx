import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TEAMS, TeamId } from '../data/teams';

interface TeamFlagProps {
  teamId: TeamId;
  /** Pixel position of the marker's center on the map */
  centerX: number;
  centerY: number;
  /** The rendered size of the marker image, used to position the flag above it */
  markerSize: number;
}

const FLAG_WIDTH  = 14;
const FLAG_HEIGHT = 11;
const POLE_WIDTH  = 2;
const POLE_HEIGHT = 4;

const TeamFlag = ({ teamId, centerX, centerY, markerSize }: TeamFlagProps) => {
  const team = TEAMS[teamId];

  // Pin the pole base to the top-center of the marker
  const poleBaseX = centerX - POLE_WIDTH / 2 - 3;
  const poleBaseY = centerY - markerSize / 2 - POLE_HEIGHT;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        { left: poleBaseX, top: poleBaseY },
      ]}
    >
      {/* Flag banner */}
      <View style={[styles.flag, { backgroundColor: team.color }]}>
        <Text style={styles.label}>{team.id}</Text>
      </View>

      {/* Pole */}
      <View style={styles.pole} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'flex-start',
  },
  flag: {
    width: FLAG_WIDTH,
    height: FLAG_HEIGHT,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // Notch cut into the right side via a small offset shadow trick
    marginLeft: POLE_WIDTH,
  },
  label: {
    color: '#fff',
    fontSize:8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pole: {
    width: POLE_WIDTH,
    height: POLE_HEIGHT,
    backgroundColor: '',
    borderRadius: 1,
  },
});

export default TeamFlag;
