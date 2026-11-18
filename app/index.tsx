import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Ionicons name="aperture-outline" size={22} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PoseMate</Text>
          <Pressable accessibilityLabel="Open settings" style={styles.iconButton}>
            <Ionicons name="settings-outline" size={21} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>YOUR POSE, YOUR MOMENT</Text>
          <Text style={styles.title}>Recreate the{`\n`}shot you love.</Text>
          <Text style={styles.subtitle}>
            Overlay any reference photo on your camera and find the perfect pose with confidence.
          </Text>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewGlow} />
          <Ionicons name="images-outline" size={40} color={colors.accent} />
          <Text style={styles.previewTitle}>Your next great photo starts here.</Text>
          <Text style={styles.previewBody}>Choose a reference pose to begin.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/camera')}>
            <Ionicons name="camera-outline" size={22} color={colors.background} />
            <Text style={styles.primaryLabel}>Start Shooting</Text>
            <Ionicons name="arrow-forward" size={19} color={colors.background} />
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Ionicons name="image-outline" size={20} color={colors.accent} />
            <Text style={styles.secondaryLabel}>Choose Reference Photo</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLabel}>RECENT REFERENCES</Text>
          <Text style={styles.emptyText}>Your recent poses will appear here.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { flex: 1, color: colors.text, fontSize: 19, fontWeight: '700', letterSpacing: 0.2 },
  iconButton: { padding: spacing.sm },
  hero: { paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1.8, marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 42, lineHeight: 46, fontWeight: '700', letterSpacing: -1.2 },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 23, marginTop: spacing.md, maxWidth: 330 },
  previewCard: {
    height: 190,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewGlow: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: '#3A2D22', opacity: 0.5 },
  previewTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: spacing.md },
  previewBody: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
  primaryButton: { height: 58, borderRadius: radii.md, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm },
  primaryLabel: { flex: 1, color: colors.background, fontSize: 16, fontWeight: '700' },
  secondaryButton: { height: 52, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  secondaryLabel: { color: colors.text, fontSize: 14, fontWeight: '600' },
  footer: { marginTop: spacing.xl },
  footerLabel: { color: colors.textSubtle, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  emptyText: { color: colors.textSubtle, fontSize: 13, marginTop: spacing.sm },
});
