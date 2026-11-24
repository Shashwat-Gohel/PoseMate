import { ActivityIndicator, Animated, AppState, Image, LayoutAnimation, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { colors, radii, spacing, typography } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

export default function CameraScreen() {
  const { referenceUri } = useLocalSearchParams<{ referenceUri?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(0); // 0 (1x) to 1 (max zoom)
  const [overlayOpacity, setOverlayOpacity] = useState(0.55);
  const [overlayLocked, setOverlayLocked] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [overlayScale, setOverlayScale] = useState(1);
  const [overlayRotation, setOverlayRotation] = useState(0);
  const [overlayFlipped, setOverlayFlipped] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(false);
  const [controlsExpanded, setControlsExpanded] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<0 | 3 | 5 | 10>(0);
  const [timerCountdown, setTimerCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [isAppActive, setIsAppActive] = useState(true);
  const [overlayError, setOverlayError] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const sliderStart = useRef(overlayOpacity);
  const gestureStart = useRef({ x: 0, y: 0, scale: 1, rotation: 0, distance: 0, angle: 0 });
  const shutterFlashOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const active = nextState === 'active';
      setIsAppActive(active);
      if (!active) setIsCameraReady(false);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const updateOpacityFromTouch = (locationX: number) => {
    if (!sliderWidth) return;
    const nextOpacity = Math.min(1, Math.max(0.05, locationX / sliderWidth));
    setOverlayOpacity(nextOpacity);
  };

  const opacityResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      sliderStart.current = overlayOpacity;
      updateOpacityFromTouch(event.nativeEvent.locationX);
    },
    onPanResponderMove: (event) => updateOpacityFromTouch(event.nativeEvent.locationX),
  }), [overlayOpacity, sliderWidth]);

  const resetOverlay = () => {
    setOverlayOpacity(0.55);
    setOverlayPosition({ x: 0, y: 0 });
    setOverlayScale(1);
    setOverlayRotation(0);
    setOverlayFlipped(false);
    setCameraZoom(0);
  };

  const nudgeOverlay = (x: number, y: number) => {
    if (overlayLocked) return;
    setOverlayPosition((current) => ({ x: current.x + x, y: current.y + y }));
  };

  const adjustOverlayZoom = (delta: number) => {
    if (overlayLocked) return;
    setOverlayScale((current) => Math.min(5, Math.max(0.35, +(current + delta).toFixed(2))));
  };

  const cycleCameraZoom = () => {
    setCameraZoom((prev) => {
      if (prev < 0.1) return 0.25; // ~2x
      if (prev < 0.35) return 0.5; // ~3x
      return 0; // 1x
    });
  };

  const cycleTimer = () => {
    setTimerSeconds((prev) => {
      if (prev === 0) return 3;
      if (prev === 3) return 5;
      if (prev === 5) return 10;
      return 0;
    });
  };

  const toggleControls = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setControlsExpanded((current) => !current);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || !isCameraReady || isCapturing) return;

    if (timerSeconds > 0 && timerCountdown === null) {
      // Start countdown
      setTimerCountdown(timerSeconds);
      let remaining = timerSeconds;
      timerRef.current = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimerCountdown(null);
          // Fire actual capture after countdown
          void fireCaptureNow();
        } else {
          setTimerCountdown(remaining);
        }
      }, 1000);
      return;
    }

    await fireCaptureNow();
  };

  const fireCaptureNow = async () => {
    if (!cameraRef.current || !isCameraReady || isCapturing) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    shutterFlashOpacity.setValue(1);
    Animated.timing(shutterFlashOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
    setCaptureError(null);
    setIsCapturing(true);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (!result?.uri) throw new Error('Capture returned no image.');
      setCapturedUri(result.uri);
      router.push({ pathname: '/preview', params: { capturedUri: result.uri } });
    } catch {
      setCaptureError('We could not capture the photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const gestureResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponderCapture: (event) => !overlayLocked && event.nativeEvent.touches.length > 1,
    onMoveShouldSetPanResponderCapture: (event) => !overlayLocked && event.nativeEvent.touches.length > 1,
    onStartShouldSetPanResponder: () => !overlayLocked,
    onMoveShouldSetPanResponder: (_event, gestureState) => !overlayLocked && (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2),
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => true,
    onPanResponderGrant: (event) => {
      const touches = event.nativeEvent.touches;
      const first = touches[0];
      const second = touches[1];
      const distance = first && second ? Math.hypot(second.pageX - first.pageX, second.pageY - first.pageY) : 0;
      const angle = first && second ? Math.atan2(second.pageY - first.pageY, second.pageX - first.pageX) * 180 / Math.PI : 0;
      gestureStart.current = { x: overlayPosition.x, y: overlayPosition.y, scale: overlayScale, rotation: overlayRotation, distance, angle };
    },
    onPanResponderMove: (event, gestureState) => {
      if (overlayLocked) return;
      const touches = event.nativeEvent.touches;
      const first = touches[0];
      const second = touches[1];
      if (first && second) {
        const distance = Math.hypot(second.pageX - first.pageX, second.pageY - first.pageY);
        const angle = Math.atan2(second.pageY - first.pageY, second.pageX - first.pageX) * 180 / Math.PI;
        if (gestureStart.current.distance > 0 && distance > 0) {
          const scaleFactor = distance / gestureStart.current.distance;
          setOverlayScale(Math.min(5, Math.max(0.35, gestureStart.current.scale * scaleFactor)));
          if (rotationEnabled) setOverlayRotation(gestureStart.current.rotation + angle - gestureStart.current.angle);
        } else {
          // If second finger just touched mid-gesture
          gestureStart.current.distance = distance;
          gestureStart.current.scale = overlayScale;
          gestureStart.current.angle = angle;
          gestureStart.current.rotation = overlayRotation;
        }
      } else if (touches.length === 1 && !gestureStart.current.distance) {
        setOverlayPosition({ x: gestureStart.current.x + gestureState.dx, y: gestureStart.current.y + gestureState.dy });
      }
    },
    onPanResponderRelease: () => {
      gestureStart.current.distance = 0;
    },
  }), [overlayLocked, rotationEnabled, overlayPosition.x, overlayPosition.y, overlayScale, overlayRotation]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  if (!permission) {
    return <View style={styles.permissionState}><Text style={styles.previewText}>Preparing camera…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionState}>
        <Ionicons name="camera-outline" size={48} color={colors.accent} />
        <Text style={styles.previewText}>Camera access is needed</Text>
        <Text style={styles.previewHint}>PoseMate uses your camera to help align and capture your pose.</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonLabel}>Allow Camera</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}><Text style={styles.cancelLabel}>Not now</Text></Pressable>
      </SafeAreaView>
    );
  }

  if (cameraError) {
    return (
      <SafeAreaView style={styles.permissionState}>
        <Ionicons name="warning-outline" size={48} color={colors.accent} />
        <Text style={styles.previewText}>Camera unavailable</Text>
        <Text style={styles.previewHint}>{cameraError}</Text>
        <Pressable style={styles.permissionButton} onPress={() => {
          setCameraError(null);
          setIsCameraReady(false);
        }}>
          <Text style={styles.permissionButtonLabel}>Try again</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}><Text style={styles.cancelLabel}>Close camera</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* iOS Camera Top Utility Bar */}
        <View style={styles.cameraTopBar}>
          <Pressable accessibilityLabel="Close Camera" style={({ pressed }) => [styles.glassIconButton, pressed && styles.pressed]} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>

          <View style={styles.topStatusPill}>
            <Text style={styles.topStatusText}>ALIGNMENT</Text>
          </View>

          <View style={styles.topActionsGroup}>
            {/* Timer Toggle */}
            <Pressable
              accessibilityLabel={timerSeconds === 0 ? 'Self-timer off' : `Self-timer ${timerSeconds} seconds`}
              style={({ pressed }) => [styles.glassIconButton, timerSeconds > 0 && styles.glassIconButtonActive, pressed && styles.pressed]}
              onPress={cycleTimer}
            >
              <Text style={[styles.timerButtonLabel, timerSeconds > 0 && styles.timerButtonLabelActive]}>
                {timerSeconds === 0 ? '⏱' : `${timerSeconds}s`}
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel={torchEnabled ? 'Flash On' : 'Flash Off'}
              style={({ pressed }) => [styles.glassIconButton, torchEnabled && styles.glassIconButtonActive, pressed && styles.pressed]}
              onPress={() => setTorchEnabled((current) => !current)}
            >
              <Ionicons name={torchEnabled ? 'flash' : 'flash-off-outline'} size={20} color={torchEnabled ? colors.accent : '#FFFFFF'} />
            </Pressable>

            <Pressable
              accessibilityLabel="Switch Camera"
              style={({ pressed }) => [styles.glassIconButton, pressed && styles.pressed]}
              onPress={() => setFacing((current) => current === 'back' ? 'front' : 'back')}
            >
              <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Live Camera Viewfinder Layer */}
        <View style={styles.viewfinder}>
          {isAppActive ? (
            <CameraView
              ref={cameraRef}
              key={facing}
              style={StyleSheet.absoluteFill}
              facing={facing}
              zoom={cameraZoom}
              enableTorch={torchEnabled}
              onCameraReady={() => setIsCameraReady(true)}
              onMountError={() => {
                setIsCameraReady(false);
                setCameraError('Unable to start camera. Please restart the app.');
              }}
            />
          ) : (
            <View style={styles.cameraPaused}>
              <Text style={styles.loadingLabel}>Camera Paused</Text>
            </View>
          )}

          {/* iOS 3x3 Composition Grid Reticle */}
          <View pointerEvents="none" style={styles.compositionGrid}>
            <View style={styles.gridH1} />
            <View style={styles.gridH2} />
            <View style={styles.gridV1} />
            <View style={styles.gridV2} />
          </View>

          {isAppActive && !isCameraReady ? (
            <View pointerEvents="none" style={styles.cameraLoading}>
              <ActivityIndicator color={colors.accent} size="large" />
            </View>
          ) : null}

          {/* Reference Pose Overlay */}
          {referenceUri && !overlayError ? (
            <View pointerEvents="auto" style={styles.referenceOverlayContainer} {...gestureResponder.panHandlers}>
              <View pointerEvents="none" style={styles.referenceBoundary}>
                <Image
                  pointerEvents="none"
                  source={{ uri: referenceUri }}
                  onError={() => setOverlayError(true)}
                  style={[styles.referenceOverlay, {
                    opacity: overlayOpacity,
                    transform: [
                      { translateX: overlayPosition.x },
                      { translateY: overlayPosition.y },
                      { scale: overlayScale },
                      { rotate: `${overlayRotation}deg` },
                      { scaleX: overlayFlipped ? -1 : 1 },
                    ],
                  }]}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : null}

          {overlayError ? (
            <View pointerEvents="none" style={styles.overlayError}>
              <Text style={styles.overlayErrorText}>Reference Photo Unavailable</Text>
            </View>
          ) : null}

          {/* iOS Native Camera Zoom Pill Segment (0.5x / 1x / 2x / 3x) Floating in Viewfinder */}
          <View style={styles.floatingZoomDock}>
            <Pressable
              accessibilityLabel="1x Zoom"
              style={[styles.zoomStepPill, cameraZoom === 0 && styles.zoomStepPillActive]}
              onPress={() => setCameraZoom(0)}
            >
              <Text style={[styles.zoomStepText, cameraZoom === 0 && styles.zoomStepTextActive]}>1×</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="2x Zoom"
              style={[styles.zoomStepPill, cameraZoom === 0.25 && styles.zoomStepPillActive]}
              onPress={() => setCameraZoom(0.25)}
            >
              <Text style={[styles.zoomStepText, cameraZoom === 0.25 && styles.zoomStepTextActive]}>2×</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="3x Zoom"
              style={[styles.zoomStepPill, cameraZoom === 0.5 && styles.zoomStepPillActive]}
              onPress={() => setCameraZoom(0.5)}
            >
              <Text style={[styles.zoomStepText, cameraZoom === 0.5 && styles.zoomStepTextActive]}>3×</Text>
            </Pressable>
          </View>

          {/* Shutter Flash Overlay */}
          <Animated.View
            pointerEvents="none"
            style={[styles.shutterFlash, { opacity: shutterFlashOpacity }]}
          />

          {/* Self-Timer Countdown Overlay */}
          {timerCountdown !== null ? (
            <View pointerEvents="none" style={styles.timerCountdownOverlay}>
              <Text style={styles.timerCountdownText}>{timerCountdown}</Text>
            </View>
          ) : null}
        </View>

        {/* Bottom Control Sheet */}
        <View style={styles.bottomControlSheet}>
          {referenceUri ? (
            <View style={styles.overlayControlsCard}>
              <View style={styles.overlayControlHeader}>
                <View style={styles.overlayStatusBadge}>
                  <Text style={styles.overlayStatusLabel}>POSE OVERLAY</Text>
                  <Text style={styles.overlayValueLabel}>{Math.round(overlayOpacity * 100)}%</Text>
                </View>

                {/* Quick Action Tools */}
                <View style={styles.quickToolsRow}>
                  <Pressable accessibilityLabel="Zoom Out Reference" style={styles.microToolButton} onPress={() => adjustOverlayZoom(-0.15)}>
                    <Ionicons name="remove" size={17} color="#FFFFFF" />
                  </Pressable>
                  <Pressable accessibilityLabel="Zoom In Reference" style={styles.microToolButton} onPress={() => adjustOverlayZoom(0.15)}>
                    <Ionicons name="add" size={17} color="#FFFFFF" />
                  </Pressable>
                  <Pressable accessibilityLabel="Flip Reference" style={styles.microToolButton} onPress={() => !overlayLocked && setOverlayFlipped((c) => !c)}>
                    <Ionicons name="swap-horizontal" size={17} color="#FFFFFF" />
                  </Pressable>
                  <Pressable
                    accessibilityLabel={overlayLocked ? "Unlock Pose" : "Lock Pose"}
                    style={[styles.microToolButton, overlayLocked && styles.microToolActive]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setOverlayLocked((c) => !c);
                    }}
                  >
                    <Ionicons name={overlayLocked ? "lock-closed" : "lock-open-outline"} size={16} color={overlayLocked ? colors.accent : "#FFFFFF"} />
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Reset Pose Alignment"
                    style={styles.microToolButton}
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      resetOverlay();
                    }}
                  >
                    <Ionicons name="refresh" size={16} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>

              {/* iOS Native Slider Track */}
              <View onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)} style={styles.sliderTrack} {...opacityResponder.panHandlers}>
                <View style={[styles.sliderFill, { width: `${overlayOpacity * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${overlayOpacity * 100}%` }]} />
              </View>
            </View>
          ) : (
            <Text style={styles.tipText}>Tap Photos to add a reference pose overlay</Text>
          )}

          {captureError ? <Text style={styles.captureErrorText}>{captureError}</Text> : null}

          {/* iOS Camera Shutter Dock */}
          <View style={styles.shutterRow}>
            <View style={styles.shutterSidePlaceholder} />

            <Pressable
              accessibilityLabel="Take Photo"
              accessibilityState={{ busy: isCapturing }}
              hitSlop={12}
              onPress={capturePhoto}
              disabled={!isCameraReady || isCapturing}
              style={[styles.iosShutterOuterRing, (!isCameraReady || isCapturing) && styles.shutterDisabled]}
            >
              <View style={styles.iosShutterInnerButton}>
                {isCapturing ? <ActivityIndicator color="#000000" size="small" /> : null}
              </View>
            </Pressable>

            <View style={styles.shutterSidePlaceholder} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  permissionState: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  container: { flex: 1, backgroundColor: '#000000' },

  // Top Bar
  cameraTopBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  glassIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(44, 44, 46, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassIconButtonActive: {
    backgroundColor: 'rgba(255, 214, 10, 0.25)',
  },
  topStatusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(44, 44, 46, 0.6)',
  },
  topStatusText: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  topActionsGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pressed: { opacity: 0.7 },

  // Viewfinder
  viewfinder: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 8,
  },
  compositionGrid: { ...StyleSheet.absoluteFill, zIndex: 1, opacity: 0.18 },
  gridH1: { position: 'absolute', top: '33.33%', left: 0, right: 0, height: 1, backgroundColor: '#FFFFFF' },
  gridH2: { position: 'absolute', top: '66.66%', left: 0, right: 0, height: 1, backgroundColor: '#FFFFFF' },
  gridV1: { position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: 1, backgroundColor: '#FFFFFF' },
  gridV2: { position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: 1, backgroundColor: '#FFFFFF' },
  referenceOverlayContainer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  referenceOverlay: { width: '82%', height: '68%' },
  referenceBoundary: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  cameraLoading: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000', zIndex: 5 },
  cameraPaused: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' },
  shutterFlash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    zIndex: 99,
  },
  timerCountdownOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 50,
  },
  timerCountdownText: {
    color: '#FFFFFF',
    fontSize: 96,
    fontWeight: '300',
    letterSpacing: -4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  timerButtonLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '700',
  },
  timerButtonLabelActive: {
    color: colors.accent,
  },
  loadingLabel: { color: colors.textMuted, fontSize: 13, marginTop: spacing.sm },
  overlayError: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  overlayErrorText: { color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, fontSize: 13 },

  // Floating Zoom Dial in Viewfinder
  floatingZoomDock: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 28, 30, 0.72)',
    padding: 3,
    borderRadius: radii.pill,
    zIndex: 10,
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  zoomStepPill: {
    width: 38,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomStepPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  zoomStepText: { color: 'rgba(255, 255, 255, 0.75)', fontSize: 12, fontWeight: '700' },
  zoomStepTextActive: { color: colors.accent },

  // Bottom Control Sheet
  bottomControlSheet: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayControlsCard: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  overlayControlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overlayStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  overlayStatusLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  overlayValueLabel: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  quickToolsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  microToolButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  microToolActive: { backgroundColor: 'rgba(255, 214, 10, 0.2)' },
  sliderTrack: {
    height: 24,
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  sliderFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.accent, opacity: 0.8 },
  sliderThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    marginLeft: -11,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: { color: colors.textSubtle, fontSize: 13, marginBottom: spacing.sm },
  captureErrorText: { color: colors.danger, fontSize: 13, marginBottom: 8, textAlign: 'center' },

  // Apple Camera Shutter
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  shutterSidePlaceholder: { width: 50 },
  iosShutterOuterRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  iosShutterInnerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDisabled: { opacity: 0.3 },

  previewText: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.md },
  previewHint: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs, textAlign: 'center', maxWidth: 280 },
  permissionButton: { marginTop: spacing.xl, backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: radii.pill },
  permissionButtonLabel: { color: '#000000', fontWeight: '700', fontSize: 16 },
  cancelLabel: { color: colors.textMuted, marginTop: spacing.md, fontSize: 14 },
});
