import React from "react";
import { View } from "react-native";

type MarkerConnectionProps = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** When true the path is open (parent or child belongs to Team A / conquered).
   *  When false the path is blocked. */
  unblocked: boolean;
};

// ── Unblocked style ───────────────────────────────────────────────────────────
const LINE_COLOR_OPEN   = "rgba(255, 222, 205, 0.85)";
// const SHADOW_COLOR_OPEN = "rgba(200, 120, 0, 0.5)";

// ── Blocked style ─────────────────────────────────────────────────────────────
const LINE_COLOR_BLOCKED   = "rgba(120, 120, 120, 0.35)";
const SHADOW_COLOR_BLOCKED = "rgba(0, 0, 0, 0.25)";

const DASH_LENGTH      = 12;
const GAP_LENGTH       = 8;
const LINE_THICKNESS   = 2;
const SHADOW_THICKNESS = 6;

interface DashedLineProps {
  length: number;
  thickness: number;
  color: string;
}

const DashedLine = ({ length, thickness, color }: DashedLineProps) => {
  const dashes: React.ReactElement[] = [];
  let x = 0;
  while (x < length) {
    const dashW = Math.min(DASH_LENGTH, length - x);
    dashes.push(
      <View
        key={x}
        style={{
          position: "absolute",
          left: x,
          top: 12,
          width: dashW,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
        }}
      />
    );
    x += DASH_LENGTH + GAP_LENGTH;
  }
  return (
    <View style={{ width: length, height: thickness }}>
      {dashes}
    </View>
  );
};

const MarkerConnection: React.FC<MarkerConnectionProps> = ({ from, to, unblocked }) => {
  const dx     = to.x - from.x;
  const dy     = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle  = Math.atan2(dy, dx) * (180 / Math.PI);

  const centerX = (from.x + to.x) / 2 - 4;
  const centerY = (from.y + to.y) / 2 + 12;

  const lineColor   = unblocked ? LINE_COLOR_OPEN   : LINE_COLOR_BLOCKED;
  const shadowColor = SHADOW_COLOR_BLOCKED;

  return (
    <>
      {/* Shadow */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: centerX - length / 2,
          top: centerY - SHADOW_THICKNESS / 2,
          width: length,
          height: SHADOW_THICKNESS,
          transform: [{ rotate: `${angle}deg` }],
        }}
      >
        <DashedLine length={length} thickness={SHADOW_THICKNESS} color={shadowColor} />
      </View>

      {/* Main line */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: centerX - length / 2,
          top: centerY - LINE_THICKNESS / 2,
          width: length,
          height: LINE_THICKNESS,
          transform: [{ rotate: `${angle}deg` }],
        }}
      >
        <DashedLine length={length} thickness={LINE_THICKNESS} color={lineColor} />
      </View>
    </>
  );
};

export default MarkerConnection;