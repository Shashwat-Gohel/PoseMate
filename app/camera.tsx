import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { colors, radii, spacing } from '@/constants/theme';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  if (!permission) {
    return <View style={styles.permissionState}><Text style={styles.previewText}>Preparing camera…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionState}>
        <Ionicons name="camera-outline" size={48} color={colors.accent} />
        <Text style={styles.previewText}>Camera access is needed</Text>
        <Text style={styles.previewHint}>PoseMate uses your camera to help align and capture your pose.</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonLabel}>Allow Camera</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}><Text style={styles.cancelLabel}>Not now</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Close camera" onPress={() => router.back()} style={styles.controlButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Camera</Text>
          <Pressable accessibilityLabel="Switch camera" style={styles.controlButton} onPress={() => setFacing((current) => current === 'back' ? 'front' : 'back')}>
            <Ionicons name="camera-reverse-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.preview}>
          <CameraView style={StyleSheet.absoluteFill} facing={facing} />
        </View>
        <View style={styles.bottomBar}>
          <Text style={styles.status}>Reference overlay controls will appear here.</Text>
          <Pressable accessibilityLabel="Capture photo" style={styles.captureButton} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#050607' },
  permissionState: { flex: 1, backgroundColor: '#050607', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  container: { flex: 1, paddingHorizontal: spacing.md },
  topBar: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.text, fontSize: 16, fontWeight: '600' },
  controlButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#17191DCC', alignItems: 'center', justifyContent: 'center' },
  preview: { flex: 1, borderRadius: radii.lg, backgroundColor: '#101215', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  previewText: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: spacing.md },
  previewHint: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  permissionButton: { marginTop: spacing.lg, backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radii.pill },
  permissionButtonLabel: { color: colors.background, fontWeight: '700', fontSize: 15 },
  cancelLabel: { color: colors.textMuted, marginTop: spacing.lg, fontSize: 14 },
  bottomBar: { minHeight: 130, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  status: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  captureButton: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.text, borderWidth: 5, borderColor: colors.accent },
});
