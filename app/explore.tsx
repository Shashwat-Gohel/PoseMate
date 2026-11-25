import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, radii, spacing, typography } from '@/constants/theme';
import {
  Gender,
  PoseCategory,
  getCategoriesByGender,
} from '@/constants/poseLibrary';

export default function ExploreScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('men');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenderSwitch = (gender: Gender) => {
    if (gender !== selectedGender) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedGender(gender);
    }
  };

  const categories = getCategoriesByGender(selectedGender);
  const filteredCategories = searchQuery.trim()
    ? categories.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : categories;

  const renderCategoryCard = ({ item }: { item: PoseCategory }) => {
    const coverImage = item.poses[0]?.image;

    return (
      <Pressable
        accessibilityLabel={`View ${item.title} pose ideas`}
        style={({ pressed }) => [
          styles.categoryCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({
            pathname: '/category',
            params: {
              gender: selectedGender,
              categoryId: item.id,
            },
          });
        }}
      >
        <View style={styles.cardImageContainer}>
          {coverImage ? (
            <Image
              source={coverImage}
              style={styles.cardCoverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.cardPlaceholder}>
              <Ionicons name="images-outline" size={32} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.cardGradientOverlay} />
          <View style={styles.badgeRow}>
            <View style={styles.poseCountBadge}>
              <Text style={styles.poseCountText}>
                {item.poses.length} poses
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.categoryEmoji}>{item.emoji}</Text>
          <Text style={styles.categoryTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable
            accessibilityLabel="Go Back"
            style={({ pressed }) => [
              styles.navBackButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.accent} />
            <Text style={styles.navBackText}>Back</Text>
          </Pressable>
          <Text style={styles.navTitle}>Pose Ideas</Text>
          <View style={styles.navPlaceholder} />
        </View>

        {/* Gender Segmented Switcher */}
        <View style={styles.genderSwitcherContainer}>
          <Pressable
            accessibilityLabel="Select Men Poses"
            style={[
              styles.genderTab,
              selectedGender === 'men' && styles.genderTabActive,
            ]}
            onPress={() => handleGenderSwitch('men')}
          >
            <Text
              style={[
                styles.genderTabText,
                selectedGender === 'men' && styles.genderTabTextActive,
              ]}
            >
              👨 Men
            </Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Select Women Poses"
            style={[
              styles.genderTab,
              selectedGender === 'women' && styles.genderTabActive,
            ]}
            onPress={() => handleGenderSwitch('women')}
          >
            <Text
              style={[
                styles.genderTabText,
                selectedGender === 'women' && styles.genderTabTextActive,
              ]}
            >
              👩 Women
            </Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={17} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${selectedGender === 'men' ? 'Men' : 'Women'} categories...`}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <Pressable
              accessibilityLabel="Clear search"
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Categories Grid */}
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderCategoryCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No categories found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different keyword or category name
              </Text>
            </View>
          }
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
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingRight: 12,
  },
  navBackText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  navTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  navPlaceholder: {
    width: 60,
  },
  genderSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: radii.pill,
    padding: 4,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  genderTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  genderTabActive: {
    backgroundColor: colors.accent,
  },
  genderTabText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  genderTabTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  gridContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    overflow: 'hidden',
    margin: 6,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardImageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#121214',
    position: 'relative',
  },
  cardCoverImage: {
    width: '100%',
    height: '100%',
  },
  cardPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  badgeRow: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  poseCountBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  poseCountText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  cardInfo: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryTitle: {
    color: colors.text,
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.7,
  },
});
