import { AppState, Linking, Platform, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { colors, radii, spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState<MediaLibrary.PermissionResponse | null>(null);

  const checkMediaPermission = async () => {
    try {
      const status = await MediaLibrary.getPermissionsAsync();
      setMediaPermission(status);
    } catch {
      // Permission API optional in case of non-standard environment
    }
  };

  useEffect(() => {
    void checkMediaPermission();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void checkMediaPermission();
      }
    });
    return () => sub.remove();
  }, []);

  const handleToggleCamera = async () => {
    if (!cameraPermission?.granted) {
      if (cameraPermission?.canAskAgain) {
        await requestCameraPermission();
      } else {
        await Linking.openSettings();
      }
    } else {
      // Direct user to device settings if they wish to revoke/change permission
      await Linking.openSettings();
    }
  };

  const isPhotosGranted = Platform.OS === 'web' || !!mediaPermission?.granted;

  const handleToggleMedia = async () => {
    if (Platform.OS === 'web') {
      return; // On web browsers, Photos access is always available on-demand via the file picker
    }
    if (!mediaPermission?.granted) {
      if (mediaPermission?.canAskAgain) {
        const next = await MediaLibrary.requestPermissionsAsync(true);
        setMediaPermission(next);
      } else {
        await Linking.openSettings();
      }
    } else {
      await Linking.openSettings();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* iOS Navigation Header */}
        <View style={styles.navBar}>
          <Pressable accessibilityLabel="Back" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Ionicons name="chevron-back" size={24} color={colors.accent} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.navTitle}>Settings</Text>
          <View style={styles.navPlaceholder} />
        </View>

        {/* Privacy Inset Grouped Section */}
        <View style={styles.groupCard}>
          <View style={styles.groupCardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed" size={18} color={colors.accent} />
            </View>
            <View style={styles.headerTextBlock}>
              <Text style={styles.cardMainTitle}>On-Device Processing</Text>
              <Text style={styles.cardSubtitle}>Your photos never leave your iPhone</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            PoseMate processes all camera frames, overlay alignments, and photos locally on your device with zero cloud connectivity or tracking.
          </Text>
        </View>

        {/* iOS Grouped List: Permissions */}
        <Text style={styles.sectionTitle}>DEVICE PERMISSIONS</Text>
        <View style={styles.iosListGroup}>
          <View style={styles.iosListItem}>
            <View style={[styles.listIconBox, { backgroundColor: '#34C759' }]}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.listTextContent}>
              <Text style={styles.listItemTitle}>Camera</Text>
              <Text style={styles.listItemSubtitle}>
                {cameraPermission?.granted ? 'Access Granted' : 'Access Required for Alignment'}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Manage Camera Permission"
              style={({ pressed }) => [
                styles.statusBadge,
                cameraPermission?.granted ? styles.statusBadgeGranted : styles.statusBadgeDenied,
                pressed && styles.pressed,
              ]}
              onPress={handleToggleCamera}
            >
              <Text style={[styles.statusBadgeText, cameraPermission?.granted && styles.statusBadgeTextGranted]}>
                {cameraPermission?.granted ? 'Allowed' : 'Allow'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.listSeparator} />

          <View style={styles.iosListItem}>
            <View style={[styles.listIconBox, { backgroundColor: '#007AFF' }]}>
              <Ionicons name="images" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.listTextContent}>
              <Text style={styles.listItemTitle}>Photos</Text>
              <Text style={styles.listItemSubtitle}>
                {isPhotosGranted ? 'Access Available' : 'Required to Pick & Save'}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Manage Photo Permission"
              style={({ pressed }) => [
                styles.statusBadge,
                isPhotosGranted ? styles.statusBadgeGranted : styles.statusBadgeDenied,
                pressed && styles.pressed,
              ]}
              onPress={handleToggleMedia}
            >
              <Text style={[styles.statusBadgeText, isPhotosGranted && styles.statusBadgeTextGranted]}>
                {isPhotosGranted ? 'Allowed' : 'Allow'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* System Settings Inset Button */}
        <Pressable
          accessibilityLabel="Open iPhone Settings"
          style={({ pressed }) => [styles.openSettingsButton, pressed && styles.pressed]}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.openSettingsButtonText}>Open in iPhone Settings</Text>
          <Ionicons name="open-outline" size={16} color={colors.accent} />
        </Pressable>

        {/* About App Section */}
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.iosListGroup}>
          <View style={styles.iosListItem}>
            <View style={[styles.listIconBox, { backgroundColor: '#5856D6' }]}>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.listTextContent}>
              <Text style={styles.listItemTitle}>PoseMate</Text>
              <Text style={styles.listItemSubtitle}>Version 1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  container: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },

  navBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', marginLeft: -6 },
  backButtonText: { color: colors.accent, fontSize: 17, fontWeight: '500' },
  navTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  navPlaceholder: { width: 50 },
  pressed: { opacity: 0.7 },

  groupCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginTop: spacing.sm,
  },
  groupCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextBlock: { flex: 1 },
  cardMainTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  cardSubtitle: { color: colors.accent, fontSize: 12, fontWeight: '500', marginTop: 1 },
  cardDescription: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },

  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 12,
  },
  iosListGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
  },
  iosListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  listIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTextContent: { flex: 1 },
  listItemTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '500' },
  listItemSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#2C2C2E',
  },
  statusBadgeGranted: { backgroundColor: 'rgba(52, 199, 89, 0.15)' },
  statusBadgeDenied: { backgroundColor: 'rgba(255, 214, 10, 0.2)' },
  statusBadgeText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  statusBadgeTextGranted: { color: colors.success },
  listSeparator: { height: 1, backgroundColor: '#2C2C2E', marginLeft: 60 },

  openSettingsButton: {
    marginTop: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  openSettingsButtonText: { color: colors.accent, fontSize: 15, fontWeight: '600' },
});
