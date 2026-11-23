import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing } from '@/constants/theme';

type AppButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary';
};

export function AppButton({ label, variant = 'primary', ...props }: AppButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityLabel={props.accessibilityLabel ?? label}
      style={({ pressed }) => [styles.base, variant === 'secondary' ? styles.secondary : styles.primary, pressed && styles.pressed]}
    >
      <Text style={variant === 'secondary' ? styles.secondaryLabel : styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  primary: { backgroundColor: colors.accent },
  secondary: { borderWidth: 1, borderColor: colors.border },
  primaryLabel: { color: colors.background, fontSize: 15, fontWeight: '700' },
  secondaryLabel: { color: colors.text, fontSize: 15, fontWeight: '600' },
  pressed: { opacity: 0.78 },
});
