import React, { useState } from 'react';
import markers, { MarkerData } from '../data/makers';
import MapMarker from './MapMarker';
import MarkerConnection from './MarkerConnection';
import MarkerInfoSheet from './MarkerInfoSheet';
import { GRID_CONFIG, cellCenter } from '../utils/mapConfig';

/** All parent→child edges derived from the marker tree */
const markerById = new Map(markers.map((m) => [m.id, m]));

const connections: Array<[MarkerData, MarkerData]> = markers
  .filter((m): m is MarkerData & { parentId: string } => Boolean(m.parentId))
  .map((m) => [markerById.get(m.parentId)!, m])
  .filter(([parent]) => Boolean(parent));

/**
 * Renders all campaign markers, connection lines, and the info sheet on tap.
 * Must be placed inside an InteractiveMap so absolute positioning works correctly.
 */
const CampaignLayer = () => {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  return (
    <>
      {connections.map(([parent, child]) => (
        <MarkerConnection
          key={`${parent.id}-${child.id}`}
          from={cellCenter(parent.cell)}
          to={cellCenter(child.cell)}
        />
      ))}

      {markers.map((marker) => (
        <MapMarker
          key={marker.id}
          cell={marker.cell}
          source={marker.source}
          config={GRID_CONFIG}
          scale={marker.scale}
          onPress={() => setSelectedMarker(marker)}
        />
      ))}

      <MarkerInfoSheet
        marker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
      />
    </>
  );
};

export default CampaignLayer;
