import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <AppErrorBoundary>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="camera" options={{ gestureEnabled: false }} />
        </Stack>
      </AppErrorBoundary>
    </>
  );
}
