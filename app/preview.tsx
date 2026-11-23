import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { colors, radii, spacing, typography } from '@/constants/theme';

export default function PreviewScreen() {
  const { capturedUri } = useLocalSearchParams<{ capturedUri?: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePhoto = async () => {
    if (!capturedUri || isSaving || saved) return;
    setIsSaving(true);
    setError(null);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        setError('Photo access is needed to save this image. Please enable photo/gallery permission in Settings and try again.');
        return;
      }
      const asset = await MediaLibrary.createAssetAsync(capturedUri);
      if (asset) {
        setSaved(true);
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

  if (!capturedUri) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.title}>Photo unavailable</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/')}><Text style={styles.primaryLabel}>Return home</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Cancel and discard photo" style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]} onPress={() => router.replace('/')}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleBlock}><Text style={styles.title}>Your shot</Text><Text style={styles.subtitle}>Clean capture · overlay excluded</Text></View>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.imageFrame}>
          <Image source={{ uri: capturedUri }} style={styles.image} resizeMode="contain" />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {saved ? <Text style={styles.success}>Saved to your Photos.</Text> : null}
        <View style={styles.actions}>
          <Pressable accessibilityLabel="Retake photo" style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} onPress={() => router.back()} disabled={isSaving}>
            <Ionicons name="camera-outline" size={20} color={colors.accent} />
            <Text style={styles.secondaryLabel}>Retake</Text>
          </Pressable>
          <Pressable accessibilityLabel="Save photo" style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, (isSaving || saved) && styles.disabled]} onPress={savePhoto} disabled={isSaving || saved}>
            {isSaving ? <ActivityIndicator color={colors.background} /> : <Ionicons name="download-outline" size={20} color={colors.background} />}
            <Text style={styles.primaryLabel}>{saved ? 'Saved' : 'Save to Photos'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  titleBlock: { flex: 1, alignItems: 'center' },
  title: { color: colors.text, ...typography.title },
  subtitle: { color: colors.textSubtle, ...typography.caption, marginTop: 2 },
  imageFrame: { flex: 1, marginVertical: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 5 },
  image: { width: '100%', height: '100%' },
  actions: { gap: spacing.sm, paddingBottom: spacing.md },
  primaryButton: { minHeight: 54, borderRadius: radii.md, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  primaryLabel: { color: colors.background, fontSize: 15, fontWeight: '700' },
  secondaryButton: { minHeight: 50, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  secondaryLabel: { color: colors.text, fontSize: 15, fontWeight: '600' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.72 },
  error: { color: '#E89B8F', textAlign: 'center', fontSize: 13, lineHeight: 19, marginBottom: spacing.sm },
  success: { color: '#B7E6C1', textAlign: 'center', fontSize: 13, marginBottom: spacing.sm },
});
