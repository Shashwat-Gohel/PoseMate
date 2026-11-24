import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { colors, radii, spacing, typography } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';

export default function PreviewScreen() {
  const { capturedUri, referenceUri } = useLocalSearchParams<{ capturedUri?: string; referenceUri?: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const savePhoto = async () => {
    if (!capturedUri || isSaving || saved) return;
    setIsSaving(true);
    setError(null);
    try {
      if (Platform.OS === 'web') {
        // In web / Safari PWA, trigger standard browser download / save to Photos
        const link = document.createElement('a');
        link.href = capturedUri;
        link.download = `PoseMate_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSaved(true);
        return;
      }

      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        setError('Photo access is needed to save this image. Please enable photo/gallery permission in Settings and try again.');
        return;
      }
      // Use modern Asset.create if available, fallback to createAssetAsync
      let savedAsset = null;
      if (typeof (MediaLibrary as any).Asset?.create === 'function') {
        savedAsset = await (MediaLibrary as any).Asset.create(capturedUri);
      } else if (typeof (MediaLibrary as any).createAssetAsync === 'function') {
        savedAsset = await (MediaLibrary as any).createAssetAsync(capturedUri);
      }
      if (savedAsset) {
        setSaved(true);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setError('Could not save photo to device library.');
      }
    } catch (err: any) {
      console.error('Failed to save photo:', err);
      setError(err?.message || 'We could not save the photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const sharePhoto = async () => {
    if (!capturedUri || isSharing) return;
    setIsSharing(true);
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) {
        // Use Web Share API if supported by Safari / browser
        const response = await fetch(capturedUri);
        const blob = await response.blob();
        const file = new File([blob], `PoseMate_${Date.now()}.jpg`, { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'PoseMate Photo',
          });
          return;
        }
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        setError('Sharing is not available on this device.');
        return;
      }
      await Sharing.shareAsync(capturedUri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share your photo',
        UTI: 'public.jpeg',
      });
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // User simply cancelled share sheet
      setError('Could not open the share sheet. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  if (!capturedUri) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.emptyTitle}>Photo unavailable</Text>
        <Pressable style={styles.saveButton} onPress={() => router.replace('/')}><Text style={styles.saveButtonText}>Return to Camera</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* iOS Navigation Bar */}
        <View style={styles.iosNavBar}>
          <Pressable accessibilityLabel="Discard and return" style={({ pressed }) => [styles.navActionButton, pressed && styles.pressed]} onPress={() => router.replace('/')}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.navTitleCenter}>
            <Text style={styles.navTitle}>Photo Preview</Text>
            <Text style={styles.navSubtitle}>ORIGINAL CAPTURE</Text>
          </View>
          {referenceUri ? (
            <Pressable
              accessibilityLabel={compareMode ? 'Exit comparison mode' : 'Compare with reference'}
              style={({ pressed }) => [styles.compareToggleButton, compareMode && styles.compareToggleButtonActive, pressed && styles.pressed]}
              onPress={() => setCompareMode((c) => !c)}
            >
              <Ionicons name="git-compare-outline" size={18} color={compareMode ? colors.accent : '#FFFFFF'} />
            </Pressable>
          ) : (
            <View style={styles.navPlaceholder} />
          )}
        </View>

        {/* Photo Viewport — normal or compare mode */}
        {compareMode && referenceUri ? (
          <View style={styles.compareContainer}>
            <View style={styles.compareHalf}>
              <Image source={{ uri: capturedUri }} style={styles.image} resizeMode="cover" />
              <View style={styles.compareLabel}>
                <Text style={styles.compareLabelText}>CAPTURED</Text>
              </View>
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareHalf}>
              <Image source={{ uri: referenceUri }} style={styles.image} resizeMode="cover" />
              <View style={styles.compareLabel}>
                <Text style={styles.compareLabelText}>REFERENCE</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.photoViewport}>
            <Image source={{ uri: capturedUri }} style={styles.image} resizeMode="contain" />
          </View>
        )}

        {error ? (
          <View style={styles.errorPill}>
            <Ionicons name="alert-circle" size={17} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {saved ? (
          <View style={styles.successPill}>
            <Ionicons name="checkmark-circle" size={17} color={colors.success} />
            <Text style={styles.successText}>Saved to Photos</Text>
          </View>
        ) : null}

        {/* iOS Bottom Action Deck */}
        <View style={styles.bottomDock}>
          <Pressable accessibilityLabel="Retake Photo" style={({ pressed }) => [styles.retakeButton, pressed && styles.pressed]} onPress={() => router.back()} disabled={isSaving}>
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Share photo"
            style={({ pressed }) => [styles.shareButton, isSharing && styles.disabled, pressed && styles.pressed]}
            onPress={sharePhoto}
            disabled={isSharing}
          >
            {isSharing
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <Ionicons name="share-outline" size={19} color="#FFFFFF" />}
            <Text style={styles.shareButtonText}>Share</Text>
          </Pressable>

          <Pressable accessibilityLabel="Save to Photos" style={({ pressed }) => [styles.saveButton, (isSaving || saved) && styles.disabled, pressed && styles.pressed]} onPress={savePhoto} disabled={isSaving || saved}>
            {isSaving ? <ActivityIndicator size="small" color="#000000" /> : <Ionicons name={saved ? "checkmark" : "download-outline"} size={19} color="#000000" />}
            <Text style={styles.saveButtonText}>{saved ? 'Saved' : 'Save Photo'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  centered: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '600' },
  container: { flex: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.lg },

  iosNavBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  navActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(44, 44, 46, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleCenter: { alignItems: 'center' },
  navTitle: { color: colors.text, fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },
  navSubtitle: { color: colors.accent, fontSize: 9.5, fontWeight: '700', letterSpacing: 0.8, marginTop: 1 },
  navPlaceholder: { width: 36 },
  compareToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(44, 44, 46, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareToggleButtonActive: {
    backgroundColor: 'rgba(255, 214, 10, 0.2)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  compareContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  compareHalf: {
    flex: 1,
    position: 'relative',
  },
  compareDivider: {
    height: 2,
    backgroundColor: colors.accent,
  },
  compareLabel: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  compareLabelText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  pressed: { opacity: 0.7 },

  photoViewport: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  image: { width: '100%', height: '100%' },

  errorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    marginBottom: spacing.sm,
  },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '500' },

  successPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    marginBottom: spacing.sm,
  },
  successText: { color: colors.success, fontSize: 13, fontWeight: '600' },

  bottomDock: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  retakeButton: {
    flex: 1,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  retakeButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  shareButton: {
    flex: 1,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shareButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  saveButton: {
    flex: 1.5,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: { color: '#000000', fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.6 },
});
