import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Prevent the splash from hiding until we explicitly hide it.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash after the first render (fonts/assets are synchronous in this app).
    SplashScreen.hideAsync();

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // 0. Register Service Worker for 100% offline support
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.log('SW registration failed:', err);
          });
        });
      }

      // Add manifest & Apple Web App meta tags
      let manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.setAttribute('rel', 'manifest');
        manifestLink.setAttribute('href', '/manifest.json');
        document.head.appendChild(manifestLink);
      }

      let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      if (!appleMeta) {
        appleMeta = document.createElement('meta');
        appleMeta.setAttribute('name', 'apple-mobile-web-app-capable');
        appleMeta.setAttribute('content', 'yes');
        document.head.appendChild(appleMeta);
      }

      // 1. Prevent Safari & mobile browser pinch-to-zoom on the webpage
      let meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        document.head.appendChild(meta);
      }
      meta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );

      // 2. Prevent gesture events (Safari iOS specific zoom gestures)
      const preventGesture = (e: Event) => e.preventDefault();
      document.addEventListener('gesturestart', preventGesture, { passive: false });
      document.addEventListener('gesturechange', preventGesture, { passive: false });
      document.addEventListener('gestureend', preventGesture, { passive: false });

      // 3. Disable double-tap to zoom
      let lastTouchEnd = 0;
      const preventDoubleTap = (e: TouchEvent) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      };
      document.addEventListener('touchend', preventDoubleTap, false);

      return () => {
        document.removeEventListener('gesturestart', preventGesture);
        document.removeEventListener('gesturechange', preventGesture);
        document.removeEventListener('gestureend', preventGesture);
        document.removeEventListener('touchend', preventDoubleTap);
      };
    }
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AppErrorBoundary>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="camera" options={{ gestureEnabled: false }} />
          <Stack.Screen name="explore" options={{ gestureEnabled: true }} />
          <Stack.Screen name="category" options={{ gestureEnabled: true }} />
        </Stack>
      </AppErrorBoundary>
    </>
  );
}
