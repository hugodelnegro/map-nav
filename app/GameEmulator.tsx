import React, { useCallback, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DifficultyEntry, OppPiece } from '../data/formations';
import { RoundRecord, recordVictory } from '../utils/markerHistory';

interface Props {
  markerId: string;
  entry: DifficultyEntry;
  onExit: () => void;
  /** Called after a victory is persisted so the parent can refresh flag state. */
  onVictory?: () => void;
}

const PIECE_EMOJI: Record<string, string> = {
  king: '♚', queen: '♛', rook: '♜', bishop: '♝', pawn: '♟',
};
const ALL_PIECES = ['pawn', 'bishop', 'rook', 'queen', 'king'];

const YELLOW  = '#FFD232';
const MUTED   = '#997a20';
const BG      = '#1a1208';
const CARD    = '#241a08';
const CHIP    = '#2e2008';
const BORDER  = '#3a2a0a';
const GREEN   = '#4caf50';
const RED     = '#e05252';
const GREEN_B = 'rgba(76,175,80,0.15)';
const RED_B   = 'rgba(224,82,82,0.15)';

const turnLabel = (i: number) => i % 2 === 0 ? 'Player first' : 'CPU first';

const SectionLabel = ({ text }: { text: string }) => (
  <Text style={styles.sectionLabel}>{text}</Text>
);

const PieceBtn = ({ name, level, selected, color, onPress }: {
  name: string; level?: number; selected: boolean; color: string; onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.pieceBtn,
      selected && { borderColor: color, backgroundColor: color === GREEN ? GREEN_B : RED_B },
    ]}
  >
    <Text style={[styles.pieceBtnText, selected && { color }]}>
      {PIECE_EMOJI[name] ?? '?'} {name}{level && level > 1 ? ` Lv${level}` : ''}
    </Text>
  </Pressable>
);

const RoundSummary = ({ round, roundNum, variantIndex, totalRounds }: {
  round: RoundRecord; roundNum: number; variantIndex: number; totalRounds: number;
}) => (
  <View style={[styles.roundSummary, styles.roundSummaryWon]}>
    <View style={styles.roundSummaryHeader}>
      <Text style={styles.roundSummaryTitle}>Round {roundNum}/{totalRounds}</Text>
      <Text style={styles.roundSummaryTurn}>{turnLabel(variantIndex)}</Text>
      <Text style={styles.victoryTag}>♚ Won</Text>
    </View>
    <View style={styles.pieceRow}>
      {round.piecesKilled.map((p, i) => (
        <View key={`k${i}`} style={[styles.chip, { backgroundColor: GREEN_B, borderColor: GREEN }]}>
          <Text style={[styles.chipText, { color: GREEN }]}>{PIECE_EMOJI[p] ?? '?'} {p}</Text>
        </View>
      ))}
      {round.piecesLost.map((p, i) => (
        <View key={`l${i}`} style={[styles.chip, { backgroundColor: RED_B, borderColor: RED }]}>
          <Text style={[styles.chipText, { color: RED }]}>{PIECE_EMOJI[p] ?? '?'} {p}</Text>
        </View>
      ))}
      {round.piecesKilled.length === 0 && round.piecesLost.length === 0 && (
        <Text style={{ color: BORDER, fontSize: 12 }}>no pieces exchanged</Text>
      )}
    </View>
  </View>
);

const GameEmulator = ({ markerId, entry, onExit, onVictory }: Props) => {
  const totalRounds = entry.variants.length;
  const scrollRef   = useRef<ScrollView>(null);

  const [rounds, setRounds] = useState<RoundRecord[]>([]);
  const [killed, setKilled] = useState<string[]>([]);
  const [lost,   setLost]   = useState<string[]>([]);
  const [done,   setDone]   = useState(false);

  const currentRoundIndex = rounds.length;
  const isLastRound       = currentRoundIndex === totalRounds - 1;
  const variant: OppPiece[] = entry.variants[currentRoundIndex] ?? [];
  const kingSelected        = killed.includes('king');

  const toggleKill = (name: string) =>
    setKilled(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  const toggleLost = (name: string) =>
    setLost(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  const winRound = useCallback(async () => {
    const finalKilled = killed.includes('king') ? killed : [...killed, 'king'];
    const newRound: RoundRecord = { piecesKilled: finalKilled, piecesLost: lost };
    const nextRounds = [...rounds, newRound];

    setRounds(nextRounds);
    setKilled([]);
    setLost([]);

    if (nextRounds.length >= totalRounds) {
      await recordVictory(markerId, nextRounds);
      onVictory?.();
      setDone(true);
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 60);
    }
  }, [killed, lost, rounds, totalRounds, markerId, onVictory]);

  const playAgain = () => {
    setRounds([]);
    setKilled([]);
    setLost([]);
    setDone(false);
  };

  if (totalRounds === 0) {
    return (
      <Modal transparent animationType="fade" visible onRequestClose={onExit}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={{ color: RED, padding: 24 }}>No variants found for this marker.</Text>
            <Pressable style={styles.primaryBtn} onPress={onExit}>
              <Text style={styles.primaryBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  const totalKilled = rounds.reduce((n, r) => n + r.piecesKilled.length, 0);
  const totalLost   = rounds.reduce((n, r) => n + r.piecesLost.length, 0);
  const headerLabel = done
    ? 'Game complete'
    : `Round ${currentRoundIndex + 1} of ${totalRounds} · ${turnLabel(currentRoundIndex)}`;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onExit}>
      <View style={styles.backdrop}>
        <View style={styles.card}>

          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.stageLabel}>Stage {markerId} · {entry.name}</Text>
              <Text style={styles.phaseLabel}>{headerLabel}</Text>
            </View>
            <Pressable onPress={onExit} hitSlop={16} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView ref={scrollRef} style={styles.body} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {done && (
              <>
                <View style={styles.statsRow}>
                  <View style={[styles.statBlock, { borderColor: GREEN }]}>
                    <Text style={styles.statNumber}>{totalKilled}</Text>
                    <Text style={[styles.statLabel, { color: GREEN }]}>killed</Text>
                  </View>
                  <View style={[styles.statBlock, { borderColor: RED }]}>
                    <Text style={styles.statNumber}>{totalLost}</Text>
                    <Text style={[styles.statLabel, { color: RED }]}>lost</Text>
                  </View>
                  <View style={[styles.statBlock, { borderColor: MUTED }]}>
                    <Text style={styles.statNumber}>{totalRounds}</Text>
                    <Text style={[styles.statLabel, { color: MUTED }]}>rounds</Text>
                  </View>
                </View>
                <SectionLabel text="Round breakdown" />
              </>
            )}

            {rounds.map((r, i) => (
              <RoundSummary key={i} round={r} roundNum={i + 1} variantIndex={i} totalRounds={totalRounds} />
            ))}

            {!done && rounds.length > 0 && (
              <View style={styles.nextRoundBanner}>
                <Text style={styles.nextRoundText}>
                  Round {currentRoundIndex + 1} of {totalRounds} · {turnLabel(currentRoundIndex)}
                </Text>
              </View>
            )}

            {!done && (
              <View style={styles.inputBlock}>
                <SectionLabel text="Formation" />
                <View style={styles.pieceRow}>
                  {variant.map((p, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>
                        {PIECE_EMOJI[p.name] ?? '?'} {p.name}{p.level && p.level > 1 ? ` Lv${p.level}` : ''}
                      </Text>
                    </View>
                  ))}
                </View>

                <SectionLabel text="Opponent pieces killed" />
                <View style={styles.pieceRow}>
                  {variant.map((p, i) => (
                    <PieceBtn
                      key={i}
                      name={p.name}
                      level={p.level}
                      selected={killed.includes(p.name)}
                      color={GREEN}
                      onPress={() => toggleKill(p.name)}
                    />
                  ))}
                </View>

                <SectionLabel text="Your pieces lost" />
                <View style={styles.pieceRow}>
                  {ALL_PIECES.map(name => (
                    <PieceBtn
                      key={name}
                      name={name}
                      selected={lost.includes(name)}
                      color={RED}
                      onPress={() => toggleLost(name)}
                    />
                  ))}
                </View>

                <Pressable
                  style={[styles.winRoundBtn, !kingSelected && styles.winRoundBtnDisabled]}
                  onPress={kingSelected ? winRound : undefined}
                >
                  <Text style={[styles.primaryBtnText, !kingSelected && { color: MUTED }]}>
                    {isLastRound ? `Win Round ${currentRoundIndex + 1} — Finish ♚` : `Win Round ${currentRoundIndex + 1} →`}
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>

          {done && (
            <View style={styles.footerRow}>
              <Pressable style={[styles.primaryBtn, { flex: 1, marginRight: 6 }]} onPress={playAgain}>
                <Text style={styles.primaryBtnText}>Play Again</Text>
              </Pressable>
              <Pressable style={[styles.outlineBtn, { flex: 1, marginLeft: 6 }]} onPress={onExit}>
                <Text style={styles.outlineBtnText}>Done</Text>
              </Pressable>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card:     { backgroundColor: BG, borderRadius: 20, borderWidth: 1.5, borderColor: YELLOW, width: '100%', maxWidth: 380, overflow: 'hidden', maxHeight: '92%' },
  header:       { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  stageLabel:   { color: MUTED, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 3 },
  phaseLabel:   { color: YELLOW, fontSize: 14, fontWeight: '500' },
  closeBtn:     { width: 34, height: 34, borderRadius: 17, backgroundColor: CHIP, borderWidth: 1.5, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { color: MUTED, fontSize: 13 },
  body:         { paddingHorizontal: 18, paddingTop: 12, maxHeight: 520 },
  sectionLabel: { color: MUTED, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8, marginTop: 12 },
  statsRow:   { flexDirection: 'row', gap: 8, marginBottom: 4 },
  statBlock:  { flex: 1, backgroundColor: CARD, borderRadius: 10, borderWidth: 1, padding: 12, alignItems: 'center' },
  statNumber: { color: '#e8d4a0', fontSize: 22, fontWeight: '500' },
  statLabel:  { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  roundSummary:       { backgroundColor: CARD, borderRadius: 8, borderWidth: 1, borderColor: BORDER, padding: 10, marginBottom: 6 },
  roundSummaryWon:    { borderColor: YELLOW },
  roundSummaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  roundSummaryTitle:  { color: YELLOW, fontSize: 12, fontWeight: '500' },
  roundSummaryTurn:   { color: MUTED, fontSize: 11, flex: 1 },
  victoryTag:         { color: GREEN, fontSize: 11, fontWeight: '500' },
  nextRoundBanner: { backgroundColor: 'rgba(255,210,50,0.08)', borderRadius: 8, borderWidth: 1, borderColor: BORDER, padding: 10, marginBottom: 4, alignItems: 'center' },
  nextRoundText:   { color: YELLOW, fontSize: 13 },
  inputBlock: { paddingBottom: 8 },
  pieceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  chip:     { backgroundColor: CHIP, borderRadius: 5, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { color: '#e8d4a0', fontSize: 12 },
  pieceBtn:         { backgroundColor: CHIP, borderRadius: 7, borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 10, paddingVertical: 5 },
  pieceBtnText:     { color: '#e8d4a0', fontSize: 13 },
  pieceBtnDisabled: { opacity: 0.3 },
  winRoundBtn:         { marginTop: 16, marginBottom: 8, backgroundColor: YELLOW, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  winRoundBtnDisabled: { backgroundColor: CHIP, borderWidth: 1, borderColor: BORDER },
  primaryBtn:     { margin: 18, marginTop: 10, backgroundColor: YELLOW, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  primaryBtnText: { color: BG, fontSize: 14, fontWeight: '500', letterSpacing: 0.5 },
  outlineBtn:     { margin: 18, marginTop: 10, borderRadius: 10, paddingVertical: 11, alignItems: 'center', borderWidth: 1.5, borderColor: YELLOW },
  outlineBtnText: { color: YELLOW, fontSize: 14, fontWeight: '500' },
  footerRow:      { flexDirection: 'row', paddingHorizontal: 18, paddingBottom: 18, paddingTop: 10 },
});

export default GameEmulator;