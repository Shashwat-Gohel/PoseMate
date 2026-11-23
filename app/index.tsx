import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { colors, radii, spacing, typography } from '@/constants/theme';

const HISTORY_KEY = '@posemate/reference-history';
const MAX_HISTORY_SIZE = 5;

export default function HomeScreen() {
  const [referenceUri, setReferenceUri] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [recentReferences, setRecentReferences] = useState<string[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(HISTORY_KEY);
        if (!stored) return;
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setRecentReferences(parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_HISTORY_SIZE));
      } catch {
        // Storage is optional; the current-session picker remains available.
      }
    };
    void loadHistory();
  }, []);

  const persistHistory = async (nextHistory: string[]) => {
    setRecentReferences(nextHistory);
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    } catch {
      // Storage may be unavailable; keep the in-memory session usable.
    }
  };

  const useReference = (uri: string) => {
    setImageError(false);
    setPickerError(null);
    setReferenceUri(uri);
    void persistHistory([uri, ...recentReferences.filter((item) => item !== uri)].slice(0, MAX_HISTORY_SIZE));
  };

  const chooseReferencePhoto = async () => {
    setPickerError(null);
    setIsPicking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPickerError('Photo access is needed to choose a reference pose. Enable it in Settings and try again.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        useReference(result.assets[0].uri);
      }
    } catch {
      setPickerError('We could not open your photo library. Please try again.');
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Ionicons name="aperture-outline" size={22} color={colors.accent} />
          </View>
          <View style={styles.brandBlock}><Text style={styles.brand}>PoseMate</Text><Text style={styles.brandTag}>POSE WITH CONFIDENCE</Text></View>
          <Pressable accessibilityLabel="Open settings" style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={21} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.eyebrowRow}><View style={styles.eyebrowDot} /><Text style={styles.eyebrow}>YOUR POSE, YOUR MOMENT</Text></View>
          <Text style={styles.title}>Recreate the{`\n`}shot you love.</Text>
          <Text style={styles.subtitle}>
            Overlay any reference photo on your camera and find the perfect pose with confidence.
          </Text>
        </View>

        <View style={[styles.previewCard, referenceUri && !imageError && styles.previewCardSelected]}>
          {referenceUri && !imageError ? (
            <>
            <Image source={{ uri: referenceUri }} onError={() => {
              setImageError(true);
              void persistHistory(recentReferences.filter((item) => item !== referenceUri));
            }} style={styles.referenceImage} resizeMode="cover" />
            <View style={styles.previewBadge}><Ionicons name="checkmark-circle" size={14} color={colors.accent} /><Text style={styles.previewBadgeText}>Reference ready</Text></View>
            </>
          ) : (
            <>
              <View style={styles.previewGlow} />
              <Ionicons name="images-outline" size={40} color={colors.accent} />
              <Text style={styles.previewTitle}>{imageError ? 'Reference photo unavailable' : 'Your next great photo starts here'}</Text>
              <Text style={styles.previewBody}>{imageError ? 'Choose another photo to continue.' : 'Choose a reference pose to begin.'}</Text>
            </>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable accessibilityLabel="Start shooting" style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={() => router.push({ pathname: '/camera', params: referenceUri ? { referenceUri } : undefined })}>
            <Ionicons name="camera-outline" size={22} color={colors.background} />
            <Text style={styles.primaryLabel}>{referenceUri ? 'Start aligning' : 'Start shooting'}</Text>
            <Ionicons name="arrow-forward" size={19} color={colors.background} />
          </Pressable>
          <Pressable accessibilityLabel={referenceUri ? 'Replace reference photo' : 'Choose reference photo'} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} onPress={chooseReferencePhoto} disabled={isPicking}>
            {isPicking ? <ActivityIndicator color={colors.accent} /> : <Ionicons name="image-outline" size={20} color={colors.accent} />}
            <Text style={styles.secondaryLabel}>{referenceUri ? 'Replace Reference Photo' : 'Choose Reference Photo'}</Text>
          </Pressable>
          {referenceUri ? (
            <Pressable accessibilityLabel="Remove reference photo" style={styles.removeButton} onPress={() => setReferenceUri(null)}>
              <Ionicons name="trash-outline" size={17} color={colors.textMuted} />
              <Text style={styles.removeLabel}>Remove reference</Text>
            </Pressable>
          ) : null}
          {pickerError ? <Text style={styles.errorText}>{pickerError}</Text> : null}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerHeader}>
            <Text style={styles.footerLabel}>RECENT REFERENCES</Text>
            {recentReferences.length ? <Pressable accessibilityLabel="Clear recent references" onPress={() => void persistHistory([])}><Text style={styles.clearLabel}>Clear</Text></Pressable> : null}
          </View>
          {recentReferences.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyRow}>
              {recentReferences.map((uri) => (
                <Pressable key={uri} accessibilityLabel="Use recent reference" style={[styles.historyItem, uri === referenceUri && styles.historyItemSelected]} onPress={() => useReference(uri)}>
                  <Image source={{ uri }} style={styles.historyImage} onError={() => void persistHistory(recentReferences.filter((item) => item !== uri))} />
                </Pressable>
              ))}
            </ScrollView>
          ) : <Text style={styles.emptyText}>Your recent poses will appear here.</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBlock: { flex: 1 },
  brand: { color: colors.text, fontSize: 19, fontWeight: '700', letterSpacing: 0.2 },
  brandTag: { color: colors.textSubtle, fontSize: 8, fontWeight: '700', letterSpacing: 1.2, marginTop: 2 },
  iconButton: { padding: spacing.sm },
  pressed: { opacity: 0.72 },
  hero: { paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  eyebrowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  eyebrow: { color: colors.accent, ...typography.label },
  title: { color: colors.text, ...typography.display },
  subtitle: { color: colors.textMuted, ...typography.body, marginTop: spacing.md, maxWidth: 330 },
  previewCard: {
    height: 190,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 5,
  },
  previewCardSelected: { borderColor: colors.accentStrong },
  previewGlow: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: '#3A2D22', opacity: 0.5 },
  previewTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: spacing.md },
  previewBody: { color: colors.textMuted, ...typography.caption, marginTop: spacing.xs },
  referenceImage: { width: '100%', height: '100%' },
  previewBadge: { position: 'absolute', left: spacing.md, bottom: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: '#0C0D0FCC', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.pill },
  previewBadgeText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
  primaryButton: { height: 58, borderRadius: radii.md, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm, shadowColor: colors.accentStrong, shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  primaryLabel: { flex: 1, color: colors.background, fontSize: 16, fontWeight: '700' },
  secondaryButton: { height: 52, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  secondaryLabel: { color: colors.text, fontSize: 14, fontWeight: '600' },
  removeButton: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.sm },
  removeLabel: { color: colors.textMuted, fontSize: 13 },
  errorText: { color: '#E89B8F', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.sm },
  footer: { marginTop: spacing.xl },
  footerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerLabel: { color: colors.textSubtle, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  clearLabel: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  emptyText: { color: colors.textSubtle, fontSize: 13, marginTop: spacing.sm },
  historyRow: { gap: spacing.sm, paddingTop: spacing.sm, paddingBottom: spacing.xs },
  historyItem: { width: 58, height: 58, borderRadius: radii.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  historyItemSelected: { borderColor: colors.accent, borderWidth: 2 },
  historyImage: { width: '100%', height: '100%' },
});
