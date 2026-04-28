import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { clearMarkerHistory, getMarkerHistory } from '../utils/markerHistory';
import markers from '../data/makers';

interface GridToggleButtonProps {
  showGrid: boolean;
  onToggle: () => void;
}

// ─── Storage Inspector ────────────────────────────────────────────────────────

const StorageInspector = ({ onClose }: { onClose: () => void }) => {
  const snapshot = Object.fromEntries(
    markers.map(m => [m.id, getMarkerHistory(m.id)])
  );

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.inspectorCard}>

          <View style={styles.inspectorHeader}>
            <Text style={styles.inspectorTitle}>marker_history_v2</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator
            indicatorStyle="white"
          >
            <Text style={styles.json} selectable>
              {JSON.stringify(snapshot, null, 2)}
            </Text>
          </ScrollView>

        </View>
        {/* Tap outside the card to close */}
        <Pressable style={[StyleSheet.absoluteFill, { zIndex: -1 }]} onPress={onClose} />
      </View>
    </Modal>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const GridToggleButton = ({ showGrid, onToggle }: GridToggleButtonProps) => {
  const [showInspector, setShowInspector] = useState(false);

  if (!__DEV__) return null;

  return (
    <>
      <View style={styles.buttonStack}>
        <Pressable onPress={onToggle} style={styles.btn}>
          <Text style={styles.btnText}>GRID: {showGrid ? 'ON' : 'OFF'}</Text>
        </Pressable>

        <Pressable onPress={() => setShowInspector(true)} style={styles.btn}>
          <Text style={styles.btnText}>STORAGE</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            Alert.alert('Clear history', 'Delete all saved game records?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  await clearMarkerHistory();
                  Alert.alert('Done', 'History cleared.');
                },
              },
            ])
          }
          style={[styles.btn, styles.btnDanger]}
        >
          <Text style={styles.btnText}>CLR HISTORY</Text>
        </Pressable>
      </View>

      {showInspector && <StorageInspector onClose={() => setShowInspector(false)} />}
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  buttonStack: {
    position: 'absolute',
    right: 20,
    top: 60,
    gap: 8,
  },
  btn: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  btnDanger: {
    borderColor: '#e05252',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  inspectorCard: {
    backgroundColor: '#0d0d0d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    padding: 16,
    flex: 1,
  },
  inspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  inspectorTitle: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  closeText: {
    color: '#555',
    fontSize: 16,
  },
  json: {
    color: '#a8ff78',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});

export default GridToggleButton;