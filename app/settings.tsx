import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/constants/theme';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Back" onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.card}>
          <Ionicons name="sparkles-outline" size={30} color={colors.accent} />
          <Text style={styles.cardTitle}>PoseMate preferences</Text>
          <Text style={styles.cardBody}>PoseMate keeps your references and finished photos on your device. Camera and photo access are requested only when needed.</Text>
        </View>
        <Text style={styles.version}>PoseMate MVP · Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { height: 64, flexDirection: 'row', alignItems: 'center' },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  spacer: { width: 44 },
  card: { marginTop: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: spacing.lg },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginTop: spacing.md },
  cardBody: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  version: { color: colors.textSubtle, fontSize: 12, textAlign: 'center', marginTop: spacing.xl },
});
