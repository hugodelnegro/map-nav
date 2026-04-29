import React, { useState, useEffect } from 'react';
import markers, { MarkerData, getMarkerFormationEntry } from '../data/makers';
import MapMarker from './MapMarker';
import MarkerConnection from './MarkerConnection';
import MarkerInfoSheet from './MarkerInfoSheet';
import TeamFlag from './TeamFlag';
import { GRID_CONFIG, cellCenter, cellToPixelRect } from '../utils/mapConfig';
import MarkerStars from './MarkerStars';
import { hasBeenPlayed, loadMarkerHistory, getMarkerStars } from '../utils/markerHistory';
import MarkerLevel from './MarkerLevel';
import { getFormationById, getFormationLevel } from '../data/formations';
import { TeamId } from '../data/teams';

/** All parent→child edges derived from the marker tree */
const markerById = new Map(markers.map((m) => [m.id, m]));

const connections: Array<[MarkerData, MarkerData]> = markers
  .filter((m): m is MarkerData & { parentId: string } => Boolean(m.parentId))
  .map((m) => [markerById.get(m.parentId)!, m])
  .filter(([parent]) => Boolean(parent));

/** Pre-computed integer level for each marker, derived from its formation. */
const markerLevelMap = new Map<string, number>(
  markers.map(m => {
    const entry = getFormationById(m.formationId);
    return [m.id, entry ? getFormationLevel(entry) : 0];
  })
);

/**
 * Renders all campaign markers, connection lines, team flags, stars, levels,
 * and the info sheet on tap.
 *
 * Flag logic: if the player has won a marker, its flag switches to Team A.
 * Otherwise it shows the marker's assigned team.
 */
const CampaignLayer = () => {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  // Set of marker IDs the player has beaten — stored in React state so that
  // flag updates are guaranteed to trigger a re-render.
  const [wonMarkerIds, setWonMarkerIds] = useState<ReadonlySet<string>>(new Set());

  // Star ratings keyed by marker ID, derived from bestPerRound history.
  const [markerStars, setMarkerStars] = useState<Record<string, 0 | 1 | 2 | 3>>({});

  // Hydrate from persisted history on mount.
  useEffect(() => {
    loadMarkerHistory().then(() => {
      const won   = new Set(markers.map(m => m.id).filter(hasBeenPlayed));
      const stars = Object.fromEntries(markers.map(m => [m.id, getMarkerStars(m.id)])) as Record<string, 0 | 1 | 2 | 3>;
      setWonMarkerIds(won);
      setMarkerStars(stars);
    });
  }, []);

  const selectedEntry = selectedMarker
    ? (getMarkerFormationEntry(selectedMarker.id) ?? null)
    : null;

  const handleVictory = (markerId: string) => {
    setWonMarkerIds(prev => new Set([...prev, markerId]));
    setMarkerStars(prev => ({ ...prev, [markerId]: getMarkerStars(markerId) }));
  };

  const flagTeamFor = (marker: MarkerData): TeamId =>
    wonMarkerIds.has(marker.id) ? 'A' : marker.teamId;

  return (
    <>
      {connections.map(([parent, child]) => {
        const unblocked = wonMarkerIds.has(parent.id) || wonMarkerIds.has(child.id) || child.teamId === 'A';
        return (
          <MarkerConnection
            key={`${parent.id}-${child.id}`}
            from={cellCenter(parent.cell)}
            to={cellCenter(child.cell)}
            unblocked={unblocked}
          />
        );
      })}

      {markers.map((marker) => {
        const rect      = cellToPixelRect(marker.cell, GRID_CONFIG);
        const scale     = marker.scale ?? 2;
        const imageSize = Math.min(rect.width, rect.height) * scale;

        return (
          <React.Fragment key={marker.id}>
            <MapMarker
              cell={marker.cell}
              source={marker.source}
              config={GRID_CONFIG}
              scale={scale}
              onPress={() => setSelectedMarker(marker)}
            />
            <TeamFlag
              teamId={flagTeamFor(marker)}
              centerX={rect.centerX}
              centerY={rect.centerY}
              markerSize={imageSize}
            />
            <MarkerStars
              stars={markerStars[marker.id] ?? 0}
              centerX={rect.centerX}
              centerY={rect.centerY}
              markerSize={imageSize}
            />
            <MarkerLevel
              level={markerLevelMap.get(marker.id) ?? 0}
              centerX={rect.centerX}
              centerY={rect.centerY}
              markerSize={imageSize}
            />
          </React.Fragment>
        );
      })}

      <MarkerInfoSheet
        marker={selectedMarker}
        entry={selectedEntry}
        onClose={() => setSelectedMarker(null)}
        onVictory={() => selectedMarker && handleVictory(selectedMarker.id)}
      />
    </>
  );
};

export default CampaignLayer;