import { Component, ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

type State = { hasError: boolean };

export class AppErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('PoseMate application error', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>PoseMate could not display this screen.</Text>
        <Pressable style={styles.button} onPress={() => this.setState({ hasError: false })}>
          <Text style={styles.buttonLabel}>Try Again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { color: colors.text, fontSize: 22, fontWeight: '700' },
  message: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
  button: { backgroundColor: colors.accent, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 12, marginTop: spacing.lg },
  buttonLabel: { color: colors.background, fontWeight: '700' },
});
