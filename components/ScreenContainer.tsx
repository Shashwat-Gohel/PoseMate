import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export function ScreenContainer({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
});
