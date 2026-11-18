import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/constants/theme';

export default function CameraScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Close camera" onPress={() => router.back()} style={styles.controlButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Camera</Text>
          <Pressable accessibilityLabel="Switch camera" style={styles.controlButton}>
            <Ionicons name="camera-reverse-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.preview}>
          <Ionicons name="camera-outline" size={42} color={colors.textMuted} />
          <Text style={styles.previewText}>Camera preview coming next</Text>
          <Text style={styles.previewHint}>This screen is ready for the live camera layer.</Text>
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
  container: { flex: 1, paddingHorizontal: spacing.md },
  topBar: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.text, fontSize: 16, fontWeight: '600' },
  controlButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#17191DCC', alignItems: 'center', justifyContent: 'center' },
  preview: { flex: 1, borderRadius: radii.lg, backgroundColor: '#101215', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  previewText: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: spacing.md },
  previewHint: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  bottomBar: { minHeight: 130, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  status: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  captureButton: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.text, borderWidth: 5, borderColor: colors.accent },
});
