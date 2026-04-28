import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MarkerData } from '../data/makers';
import { DIFFICULTY_TABLE, OppPiece } from '../data/formations';

interface Props {
  marker: MarkerData | null;
  onClose: () => void;
}

const PIECE_EMOJI: Record<string, string> = {
  king:   '♚',
  queen:  '♛',
  rook:   '♜',
  bishop: '♝',
  pawn:   '♟',
};

const MAX_DOTS = 5;

const pieceLabel = (p: OppPiece) => {
  const emoji = PIECE_EMOJI[p.name] ?? '?';
  const level = p.level && p.level > 1 ? ` Lv${p.level}` : '';
  return `${emoji} ${p.name}${level}`;
};

const MarkerInfoSheet = ({ marker, onClose }: Props) => {
  if (!marker) return null;

  const entry = DIFFICULTY_TABLE.find(e => e.difficulty === marker.difficulty);
  const filledDots = Math.min(marker.difficulty + 1, MAX_DOTS);

  return (
    <Modal
      transparent
      animationType="fade"
      visible
      onRequestClose={onClose}
    >
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

          {/* Difficulty */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Difficulty</Text>
            <View style={styles.diffRow}>
              <Text style={styles.diffNumber}>{marker.difficulty}</Text>
              <View style={styles.dots}>
                {Array.from({ length: MAX_DOTS }, (_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i < filledDots ? styles.dotFilled : styles.dotEmpty]}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Variants */}
          {entry && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Variants</Text>
              <ScrollView
                style={styles.variantScroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {entry.variants.map((variant, i) => (
                  <View key={i} style={styles.variantCard}>
                    <View style={styles.variantHeader}>
                      <Text style={styles.variantTitle}>Variant {i + 1}</Text>
                      <View style={styles.turnBadge}>
                        <Text style={styles.turnBadgeText}>
                          {i % 2 === 0 ? 'Player first' : 'CPU first'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pieceRow}>
                      {variant.map((piece, j) => (
                        <View key={j} style={styles.pieceChip}>
                          <Text style={styles.pieceText}>{pieceLabel(piece)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* CTA */}
          <Pressable style={styles.playBtn} onPress={onClose}>
            <Text style={styles.playBtnText}>Play</Text>
          </Pressable>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

const YELLOW  = '#FFD232';
const MUTED   = '#997a20';
const BG      = '#1a1208';
const CARD_BG = '#241a08';
const CHIP_BG = '#2e2008';
const BORDER  = '#3a2a0a';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: BG,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: YELLOW,
    width: '100%',
    maxWidth: 360,
    overflow: 'hidden',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  stageLabel: {
    color: MUTED,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  formationName: {
    color: YELLOW,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CHIP_BG,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '500',
  },

  // Sections
  section: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 4,
  },
  sectionLabel: {
    color: MUTED,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  // Difficulty
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  diffNumber: {
    color: YELLOW,
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 32,
  },
  dots: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  dotFilled: {
    backgroundColor: YELLOW,
  },
  dotEmpty: {
    backgroundColor: BORDER,
  },

  // Variants
  variantScroll: {
    maxHeight: 220,
  },
  variantCard: {
    backgroundColor: CARD_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
    marginBottom: 8,
  },
  variantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  variantTitle: {
    color: YELLOW,
    fontSize: 12,
    fontWeight: '500',
  },
  turnBadge: {
    backgroundColor: CHIP_BG,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  turnBadgeText: {
    color: MUTED,
    fontSize: 11,
  },
  pieceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pieceChip: {
    backgroundColor: CHIP_BG,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pieceText: {
    color: '#e8d4a0',
    fontSize: 12,
  },

  // Play button
  playBtn: {
    margin: 18,
    marginTop: 10,
    backgroundColor: YELLOW,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  playBtnText: {
    color: BG,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default MarkerInfoSheet;