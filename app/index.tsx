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
        {/* iOS Navigation Header */}
        <View style={styles.navBar}>
          <View style={styles.appBrand}>
            <View style={styles.appIconPill}>
              <Ionicons name="camera" size={17} color={colors.accent} />
            </View>
            <View>
              <Text style={styles.appTitle}>PoseMate</Text>
              <Text style={styles.appSubtitle}>CAMERA OVERLAY STUDIO</Text>
            </View>
          </View>
          <Pressable accessibilityLabel="Open Settings" style={({ pressed }) => [styles.settingsPill, pressed && styles.pressed]} onPress={() => router.push('/settings')}>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={26} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Recreate poses{`\n`}with precision.</Text>
          <Text style={styles.heroSubtitle}>
            Superimpose your inspiration photo directly over your live camera viewfinder to capture the shot you envision.
          </Text>
        </View>

        {/* Primary Viewfinder Preview Card */}
        <View style={styles.cardSection}>
          <View style={[styles.previewFrame, referenceUri && !imageError && styles.previewFrameSelected]}>
            {referenceUri && !imageError ? (
              <>
                <Image source={{ uri: referenceUri }} onError={() => {
                  setImageError(true);
                  void persistHistory(recentReferences.filter((item) => item !== referenceUri));
                }} style={styles.referenceImage} resizeMode="cover" />
                <View style={styles.gradientScrim} />
                <View style={styles.activePillBadge}>
                  <Ionicons name="sparkles" size={13} color={colors.accent} />
                  <Text style={styles.activePillText}>REFERENCE READY</Text>
                </View>
              </>
            ) : (
              <View style={styles.emptyCardContainer}>
                <View style={styles.emptyIconBubble}>
                  <Ionicons name="images-outline" size={32} color={colors.accent} />
                </View>
                <Text style={styles.emptyCardTitle}>{imageError ? 'Reference Unavailable' : 'Choose a Reference Pose'}</Text>
                <Text style={styles.emptyCardSubtitle}>{imageError ? 'Please select another photo from your camera roll.' : 'Select an image from Photos to align your pose in real-time.'}</Text>
              </View>
            )}
          </View>
        </View>

        {/* iOS Native Button Strip */}
        <View style={styles.actionStrip}>
          <Pressable accessibilityLabel="Open camera" style={({ pressed }) => [styles.primaryCtaButton, pressed && styles.pressed]} onPress={() => router.push({ pathname: '/camera', params: referenceUri ? { referenceUri } : undefined })}>
            <Ionicons name="camera" size={20} color="#000000" />
            <Text style={styles.primaryCtaText}>{referenceUri ? 'Start Camera Alignment' : 'Open Camera'}</Text>
          </Pressable>

          <View style={styles.secondaryButtonRow}>
            <Pressable accessibilityLabel={referenceUri ? 'Change reference photo' : 'Select reference photo'} style={({ pressed }) => [styles.secondaryCtaButton, pressed && styles.pressed]} onPress={chooseReferencePhoto} disabled={isPicking}>
              {isPicking ? <ActivityIndicator size="small" color={colors.accent} /> : <Ionicons name="images" size={18} color={colors.accent} />}
              <Text style={styles.secondaryCtaText}>{referenceUri ? 'Change Reference' : 'Choose from Photos'}</Text>
            </Pressable>

            {referenceUri ? (
              <Pressable accessibilityLabel="Remove reference photo" style={({ pressed }) => [styles.trashCtaButton, pressed && styles.pressed]} onPress={() => setReferenceUri(null)}>
                <Ionicons name="trash-outline" size={19} color={colors.danger} />
              </Pressable>
            ) : null}
          </View>

          {pickerError ? <Text style={styles.errorText}>{pickerError}</Text> : null}
        </View>

        {/* Recent References Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>RECENT REFERENCES</Text>
            {recentReferences.length ? (
              <Pressable accessibilityLabel="Clear all recent references" hitSlop={12} onPress={() => void persistHistory([])}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>

          {recentReferences.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>
              {recentReferences.map((uri) => (
                <Pressable key={uri} accessibilityLabel="Select recent reference" style={({ pressed }) => [styles.recentThumbnail, uri === referenceUri && styles.recentThumbnailSelected, pressed && styles.pressed]} onPress={() => useReference(uri)}>
                  <Image source={{ uri }} style={styles.thumbnailImage} onError={() => void persistHistory(recentReferences.filter((item) => item !== uri))} />
                  {uri === referenceUri ? (
                    <View style={styles.thumbnailActiveBadge}>
                      <Ionicons name="checkmark" size={11} color="#000000" />
                    </View>
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyRecentBox}>
              <Text style={styles.emptyRecentText}>Photos you import will appear here for fast switching.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  navBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  appBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appIconPill: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: { color: colors.text, fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  appSubtitle: { color: colors.accent, fontSize: 8.5, fontWeight: '700', letterSpacing: 1.1, marginTop: 1 },
  settingsPill: { padding: 4 },
  pressed: { opacity: 0.72 },

  heroSection: { paddingTop: spacing.md, paddingBottom: spacing.lg },
  heroTitle: { color: colors.text, ...typography.display },
  heroSubtitle: { color: colors.textMuted, ...typography.body, marginTop: spacing.sm, maxWidth: 330, lineHeight: 21 },

  cardSection: { marginBottom: spacing.lg },
  previewFrame: {
    height: 220,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewFrameSelected: { borderColor: colors.accent, borderWidth: 1.5 },
  referenceImage: { width: '100%', height: '100%' },
  gradientScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  activePillBadge: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  activePillText: { color: colors.text, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  emptyCardContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  emptyIconBubble: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyCardTitle: { color: colors.text, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  emptyCardSubtitle: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 4, maxWidth: 260, lineHeight: 18 },

  actionStrip: { gap: spacing.sm, marginBottom: spacing.xl },
  primaryCtaButton: {
    height: 54,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryCtaText: { color: '#000000', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  secondaryButtonRow: { flexDirection: 'row', gap: spacing.sm },
  secondaryCtaButton: {
    flex: 1,
    height: 50,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  secondaryCtaText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  trashCtaButton: {
    width: 50,
    height: 50,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { color: colors.danger, fontSize: 13, textAlign: 'center', marginTop: spacing.xs },

  recentSection: { marginTop: spacing.xs },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionHeaderTitle: { color: colors.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  clearButtonText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  recentRow: { gap: spacing.sm, paddingVertical: 2 },
  recentThumbnail: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  recentThumbnailSelected: { borderColor: colors.accent, borderWidth: 2 },
  thumbnailImage: { width: '100%', height: '100%' },
  thumbnailActiveBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRecentBox: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  emptyRecentText: { color: colors.textSubtle, fontSize: 13 },
});
