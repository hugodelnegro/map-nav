import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MarkerData } from '../data/makers';
import { DIFFICULTY_TABLE, OppPiece } from '../data/formations';
import { getMarkerHistory, getBestForRound, hasBeenPlayed } from '../utils/markerHistory';
import GameEmulator from './GameEmulator';

interface Props {
  marker: MarkerData | null;
  onClose: () => void;
}

const PIECE_EMOJI: Record<string, string> = {
  king: '♚', queen: '♛', rook: '♜', bishop: '♝', pawn: '♟',
};
const MAX_DOTS   = 5;
const pieceLabel = (name: string) => `${PIECE_EMOJI[name] ?? '?'} ${name}`;

const Tab = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </Pressable>
);

const MarkerInfoSheet = ({ marker, onClose }: Props) => {
  const [activeTab,    setActiveTab]    = useState<'formation' | 'history'>('formation');
  const [showEmulator, setShowEmulator] = useState(false);

  if (!marker) return null;

  const entry      = DIFFICULTY_TABLE.find(e => e.difficulty === marker.difficulty);
  const played     = hasBeenPlayed(marker.id);
  const history    = getMarkerHistory(marker.id);
  const filledDots = Math.min(marker.difficulty + 1, MAX_DOTS);

  if (showEmulator) {
    return <GameEmulator markerId={marker.id} onExit={() => setShowEmulator(false)} />;
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.stageLabel}>Stage {marker.id}</Text>
              <Text style={styles.formationName}>{entry?.name ?? '—'}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={16} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Difficulty + games played */}
          <View style={styles.diffRow}>
            <Text style={styles.diffNumber}>{marker.difficulty}</Text>
            <View style={styles.dots}>
              {Array.from({ length: MAX_DOTS }, (_, i) => (
                <View key={i} style={[styles.dot, i < filledDots ? styles.dotFilled : styles.dotEmpty]} />
              ))}
            </View>
            {played && (
              <View style={styles.victoryBadge}>
                <Text style={styles.victoryBadgeText}>🏆 {history.gamesPlayed}×</Text>
              </View>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            <Tab label="Formation" active={activeTab === 'formation'} onPress={() => setActiveTab('formation')} />
            <Tab
              label={`Best${history.gamesPlayed > 0 ? ` (${history.gamesPlayed}×)` : ''}`}
              active={activeTab === 'history'}
              onPress={() => setActiveTab('history')}
            />
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false} nestedScrollEnabled>

            {/* Formation tab */}
            {activeTab === 'formation' && entry && entry.variants.map((variant, i) => (
              <View key={i} style={styles.variantCard}>
                <View style={styles.variantHeader}>
                  <Text style={styles.variantTitle}>Round {i + 1}</Text>
                  <View style={styles.turnBadge}>
                    <Text style={styles.turnBadgeText}>{i % 2 === 0 ? 'Player first' : 'CPU first'}</Text>
                  </View>
                </View>
                <View style={styles.pieceRow}>
                  {variant.map((p: OppPiece, j: number) => (
                    <View key={j} style={styles.pieceChip}>
                      <Text style={styles.pieceText}>
                        {pieceLabel(p.name)}{p.level && p.level > 1 ? ` Lv${p.level}` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Best tab */}
            {activeTab === 'history' && (
              history.gamesPlayed === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>Not yet beaten</Text>
                  <Text style={styles.emptySubtitle}>Win all rounds to record your best.</Text>
                </View>
              ) : (
                <>
                  <View style={styles.gamesPlayedRow}>
                    <Text style={styles.gamesPlayedLabel}>Games played</Text>
                    <Text style={styles.gamesPlayedValue}>{history.gamesPlayed}</Text>
                  </View>

                  {entry && entry.variants.map((_, i) => {
                    const best = getBestForRound(marker.id, i);
                    return (
                      <View key={i} style={styles.roundBestCard}>
                        <View style={styles.roundBestHeader}>
                          <Text style={styles.roundBestTitle}>Round {i + 1}</Text>
                          <Text style={styles.roundBestTurn}>{i % 2 === 0 ? 'Player first' : 'CPU first'}</Text>
                        </View>
                        {best ? (
                          <View>
                            <View style={styles.pieceRow}>
                              {best.piecesKilled.map((p, k) => (
                                <View key={k} style={[styles.pieceChip, { backgroundColor: 'rgba(76,175,80,0.15)', borderColor: GREEN }]}>
                                  <Text style={[styles.pieceText, { color: GREEN }]}>{PIECE_EMOJI[p] ?? '?'} {p}</Text>
                                </View>
                              ))}
                            </View>
                            {best.piecesLost.length === 0 ? (
                              <Text style={[styles.pieceText, { color: MUTED, marginTop: 4 }]}>flawless — no pieces lost</Text>
                            ) : (
                              <View style={[styles.pieceRow, { marginTop: 4 }]}>
                                {best.piecesLost.map((p, k) => (
                                  <View key={k} style={[styles.pieceChip, { backgroundColor: 'rgba(224,82,82,0.15)', borderColor: RED }]}>
                                    <Text style={[styles.pieceText, { color: RED }]}>{PIECE_EMOJI[p] ?? '?'} {p}</Text>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        ) : (
                          <Text style={{ color: MUTED, fontSize: 12 }}>—</Text>
                        )}
                      </View>
                    );
                  })}
                </>
              )
            )}

          </ScrollView>

          <Pressable style={styles.playBtn} onPress={() => setShowEmulator(true)}>
            <Text style={styles.playBtnText}>Play</Text>
          </Pressable>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

const YELLOW = '#FFD232'; const MUTED = '#997a20'; const BG = '#1a1208';
const CARD = '#241a08'; const CHIP = '#2e2008'; const BORDER = '#3a2a0a';
const GREEN = '#4caf50'; const RED = '#e05252';

const styles = StyleSheet.create({
  backdrop:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card:          { backgroundColor: BG, borderRadius: 20, borderWidth: 1.5, borderColor: YELLOW, width: '100%', maxWidth: 360, overflow: 'hidden', maxHeight: '85%' },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: CARD, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: BORDER },
  stageLabel:    { color: MUTED, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 },
  formationName: { color: YELLOW, fontSize: 18, fontWeight: '500' },
  closeBtn:      { width: 34, height: 34, borderRadius: 17, backgroundColor: CHIP, borderWidth: 1.5, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  closeBtnText:  { color: MUTED, fontSize: 13 },
  diffRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 10 },
  diffNumber:    { color: YELLOW, fontSize: 28, fontWeight: '500', lineHeight: 32 },
  dots:          { flexDirection: 'row', gap: 5, flex: 1 },
  dot:           { width: 9, height: 9, borderRadius: 5 },
  dotFilled:     { backgroundColor: YELLOW },
  dotEmpty:      { backgroundColor: BORDER },
  victoryBadge:  { backgroundColor: CHIP, borderRadius: 6, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 8, paddingVertical: 3 },
  victoryBadgeText: { color: YELLOW, fontSize: 12 },
  tabRow:        { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: BORDER, backgroundColor: CARD },
  tab:           { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 2, borderBottomColor: YELLOW },
  tabText:       { fontSize: 13, color: MUTED },
  tabTextActive: { fontSize: 13, color: YELLOW, fontWeight: '500' },
  body:          { maxHeight: 300, paddingHorizontal: 18, paddingTop: 12 },
  variantCard:   { backgroundColor: CARD, borderRadius: 10, borderWidth: 1, borderColor: BORDER, padding: 10, marginBottom: 8 },
  variantHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  variantTitle:  { color: YELLOW, fontSize: 12, fontWeight: '500' },
  turnBadge:     { backgroundColor: CHIP, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  turnBadgeText: { color: MUTED, fontSize: 11 },
  pieceRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pieceChip:     { backgroundColor: CHIP, borderRadius: 5, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 8, paddingVertical: 3 },
  pieceText:     { color: '#e8d4a0', fontSize: 12 },
  gamesPlayedRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  gamesPlayedLabel: { color: MUTED, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  gamesPlayedValue: { color: YELLOW, fontSize: 18, fontWeight: '500' },
  roundBestCard:   { backgroundColor: CARD, borderRadius: 10, borderWidth: 1, borderColor: BORDER, padding: 10, marginBottom: 8 },
  roundBestHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  roundBestTitle:  { color: YELLOW, fontSize: 12, fontWeight: '500' },
  roundBestTurn:   { color: MUTED, fontSize: 11 },
  roundBestStats:  { flexDirection: 'row', gap: 6 },
  statPill:        { backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  statPillLost:    { backgroundColor: 'rgba(224,82,82,0.15)' },
  statKilled:      { color: GREEN, fontSize: 12, fontWeight: '500' },
  statLost:        { color: RED, fontSize: 12, fontWeight: '500' },
  emptyState:      { alignItems: 'center', paddingVertical: 36 },
  emptyTitle:      { color: YELLOW, fontSize: 15, fontWeight: '500', marginBottom: 6 },
  emptySubtitle:   { color: MUTED, fontSize: 13, textAlign: 'center' },
  playBtn:         { margin: 18, marginTop: 10, backgroundColor: YELLOW, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  playBtnText:     { color: BG, fontSize: 14, fontWeight: '500', letterSpacing: 0.5 },
});

export default MarkerInfoSheet;