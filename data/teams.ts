export type TeamId = 'A' | 'B' | 'C' | 'D';

export interface TeamData {
  id: TeamId;
  name: string;
  color: string;
}

export const TEAMS: Record<TeamId, TeamData> = {
  A: { id: 'A', name: 'Team A', color: '#4a90d9' },
  B: { id: 'B', name: 'Team B', color: '#e05252' },
  C: { id: 'C', name: 'Team C', color: '#4caf50' },
  D: { id: 'D', name: 'Team D', color: '#9b59b6' },
};

/** Maps each marker ID to its assigned team. */
export const MARKER_TEAM: Record<string, TeamId> = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'A',
};

export const getTeamForMarker = (markerId: string): TeamData | undefined => {
  const teamId = MARKER_TEAM[markerId];
  return teamId ? TEAMS[teamId] : undefined;
};

export const getMarkersForTeam = (teamId: TeamId): string[] =>
  Object.entries(MARKER_TEAM)
    .filter(([, t]) => t === teamId)
    .map(([markerId]) => markerId);