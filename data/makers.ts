import { ImageSourcePropType } from 'react-native';
import { CellCoord } from '../app/MapMarker';

export interface MarkerData {
  id: string;
  cell: CellCoord;
  source: ImageSourcePropType;
  scale?: number;
}

const markers: MarkerData[] = [
  {
    id: 'castle1',
    cell: { col: 'C', row: 3 },
    source: require('../assets/images/castle1.png'),
  },
  {
    id: 'castle2',
    cell: { col: 'M', row: 12 },
    source: require('../assets/images/castle1.png'),
  },
  // Add more markers here:
  // {
  //   id: 'village1',
  //   cell: { col: 'B', row: 3 },
  //   source: require('../assets/images/village.png'),
  // },
];

export default markers;