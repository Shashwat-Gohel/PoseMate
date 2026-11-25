import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as Haptics from 'expo-haptics';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { PoseEntry, getCategory } from '@/constants/poseLibrary';

export default function CategoryDetailScreen() {
  const { categoryId } = useLocalSearchParams<{
    categoryId?: string;
  }>();

  const category = categoryId ? getCategory(categoryId) : undefined;

  const handleSelectPose = async (pose: PoseEntry) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const asset = Asset.fromModule(pose.image);
      await asset.downloadAsync();
      const targetUri = asset.localUri ?? asset.uri;

      router.push({
        pathname: '/camera',
        params: {
          referenceUri: targetUri,
        },
      });
    } catch (err) {
      console.error('Error loading pose asset:', err);
    }
  };

  if (!category) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.notFoundTitle}>Category not found</Text>
          <Pressable
            accessibilityLabel="Return to Explore"
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backHomeButtonText}>Back to Categories</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const renderPoseCard = ({ item, index }: { item: PoseEntry; index: number }) => {
    return (
      <View style={styles.poseCard}>
        <View style={styles.poseImageContainer}>
          <Image source={item.image} style={styles.poseImage} resizeMode="contain" />
          <View style={styles.poseNumberBadge}>
            <Text style={styles.poseNumberText}>#{index + 1}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.poseCaption}>{item.caption}</Text>
          <Pressable
            accessibilityLabel={`Use Pose ${index + 1} as reference`}
            style={({ pressed }) => [
              styles.useButton,
              pressed && styles.pressed,
            ]}
            onPress={() => handleSelectPose(item)}
          >
            <Ionicons name="camera" size={16} color="#000000" />
            <Text style={styles.useButtonText}>Use as Reference</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable
            accessibilityLabel="Back to Categories"
            style={({ pressed }) => [
              styles.navBackButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.accent} />
            <Text style={styles.navBackText}>Categories</Text>
          </Pressable>
          <View style={styles.navTitleCenter}>
            <Text style={styles.navTitle}>
              {category.emoji} {category.title}
            </Text>
            <Text style={styles.navSubtitle}>
              {category.poses.length} Pose References
            </Text>
          </View>
          <View style={styles.navPlaceholder} />
        </View>

        {/* Attribution Card */}
        <View style={styles.attributionBanner}>
          <Ionicons name="sparkles" size={14} color={colors.accent} />
          <Text style={styles.attributionBannerText}>
            Reference photos curated from Pinterest • Credits belong to original creators
          </Text>
        </View>

        {/* Poses Feed */}
        <FlatList
          data={category.poses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderPoseCard}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: spacing.md,
  },
  navBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  navBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingRight: 10,
  },
  navBackText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  navTitleCenter: {
    alignItems: 'center',
  },
  navTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  navSubtitle: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  navPlaceholder: {
    width: 60,
  },
  attributionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161618',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  attributionBannerText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    flexShrink: 1,
  },
  listContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  poseCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  poseImageContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#0A0A0A',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poseImage: {
    width: '100%',
    height: '100%',
  },
  poseNumberBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  poseNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardFooter: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  poseCaption: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  useButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
  },
  useButtonText: {
    color: '#000000',
    fontSize: 13.5,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  backHomeButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radii.pill,
  },
  backHomeButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
  },
});
