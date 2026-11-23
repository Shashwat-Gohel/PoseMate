import { ActivityIndicator, AppState, Image, LayoutAnimation, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { colors, radii, spacing, typography } from '@/constants/theme';

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
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [isAppActive, setIsAppActive] = useState(true);
  const [overlayError, setOverlayError] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const sliderStart = useRef(overlayOpacity);
  const gestureStart = useRef({ x: 0, y: 0, scale: 1, rotation: 0, distance: 0, angle: 0 });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const active = nextState === 'active';
      setIsAppActive(active);
      if (!active) setIsCameraReady(false);
    });
    return () => subscription.remove();
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

  const toggleControls = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setControlsExpanded((current) => !current);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || !isCameraReady || isCapturing) return;
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
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Close camera" onPress={() => router.back()} style={styles.controlButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Align your shot</Text>
          <Pressable accessibilityLabel={facing === 'back' ? 'Switch to front camera' : 'Switch to rear camera'} style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]} onPress={() => setFacing((current) => current === 'back' ? 'front' : 'back')}>
            <Ionicons name="camera-reverse-outline" size={24} color={colors.text} />
          </Pressable>
          <Pressable
            accessibilityLabel={torchEnabled ? 'Turn flash off' : 'Turn flash on'}
            accessibilityState={{ checked: torchEnabled }}
            style={({ pressed }) => [styles.controlButton, torchEnabled && styles.controlButtonActive, pressed && styles.pressed]}
            onPress={() => setTorchEnabled((current) => !current)}
          >
            <Ionicons name={torchEnabled ? 'flash' : 'flash-outline'} size={22} color={torchEnabled ? colors.background : colors.text} />
          </Pressable>
          <Pressable
            accessibilityLabel={`Camera zoom ${cameraZoom === 0 ? '1x' : cameraZoom === 0.25 ? '2x' : '3x'}`}
            style={({ pressed }) => [styles.zoomButton, cameraZoom > 0 && styles.controlButtonActive, pressed && styles.pressed]}
            onPress={cycleCameraZoom}
          >
            <Text style={[styles.zoomButtonText, cameraZoom > 0 && styles.zoomButtonTextActive]}>
              {cameraZoom === 0 ? '1x' : cameraZoom === 0.25 ? '2x' : '3x'}
            </Text>
          </Pressable>
          <Pressable accessibilityLabel={controlsExpanded ? 'Collapse overlay controls' : 'Expand overlay controls'} style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]} onPress={toggleControls}>
            <Ionicons name={controlsExpanded ? 'chevron-down' : 'options-outline'} size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.preview}>
          {/* Keep the camera as the independent background layer. */}
          {isAppActive ? <CameraView
            ref={cameraRef}
            key={facing}
            style={StyleSheet.absoluteFill}
            facing={facing}
            zoom={cameraZoom}
            enableTorch={torchEnabled}
            onCameraReady={() => setIsCameraReady(true)}
            onMountError={() => {
              setIsCameraReady(false);
              setCameraError('We could not start the camera. Check that no other app is using it, then try again.');
            }}
          /> : <View style={styles.cameraPaused}><Text style={styles.loadingLabel}>Camera paused</Text></View>}
          {isAppActive && !isCameraReady ? (
            <View pointerEvents="none" style={styles.cameraLoading}>
              <ActivityIndicator color={colors.accent} />
              <Text style={styles.loadingLabel}>Starting camera…</Text>
            </View>
          ) : null}
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
          {overlayError ? <View pointerEvents="none" style={styles.overlayError}><Text style={styles.overlayErrorText}>Reference image unavailable</Text></View> : null}
        </View>
        <View style={styles.bottomBar}>
          {referenceUri && controlsExpanded ? (
            <View style={styles.overlayControls}>
              <Text style={styles.gestureHint}>Drag · Pinch to zoom reference ({Math.round(overlayScale * 100)}%)</Text>
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Overlay {Math.round(overlayOpacity * 100)}%</Text>
                <Pressable accessibilityLabel="Zoom out reference" style={styles.smallControl} onPress={() => adjustOverlayZoom(-0.15)}>
                  <Ionicons name="remove" size={17} color={colors.text} />
                </Pressable>
                <Pressable accessibilityLabel="Zoom in reference" style={styles.smallControl} onPress={() => adjustOverlayZoom(0.15)}>
                  <Ionicons name="add" size={17} color={colors.text} />
                </Pressable>
                <Pressable accessibilityLabel={overlayLocked ? 'Unlock overlay' : 'Lock overlay'} accessibilityState={{ checked: overlayLocked }} style={[styles.smallControl, overlayLocked && styles.smallControlActive]} onPress={() => setOverlayLocked((current) => !current)}>
                  <Ionicons name={overlayLocked ? 'lock-closed' : 'lock-open-outline'} size={17} color={overlayLocked ? colors.background : colors.text} />
                </Pressable>
                <Pressable accessibilityLabel="Reset overlay" style={styles.smallControl} onPress={resetOverlay}>
                  <Ionicons name="refresh-outline" size={18} color={colors.text} />
                </Pressable>
                <Pressable accessibilityLabel="Flip overlay horizontally" style={styles.smallControl} onPress={() => !overlayLocked && setOverlayFlipped((current) => !current)}>
                  <Ionicons name="swap-horizontal-outline" size={18} color={colors.text} />
                </Pressable>
                <Pressable accessibilityLabel={rotationEnabled ? 'Disable rotation' : 'Enable rotation'} accessibilityState={{ checked: rotationEnabled }} style={[styles.smallControl, rotationEnabled && styles.smallControlActive]} onPress={() => !overlayLocked && setRotationEnabled((current) => !current)}>
                  <Ionicons name="sync-outline" size={18} color={rotationEnabled ? colors.background : colors.text} />
                </Pressable>
              </View>
              <View style={styles.nudgeRow}>
                <Pressable accessibilityLabel="Move reference left" style={styles.smallControl} onPress={() => nudgeOverlay(-12, 0)}><Ionicons name="arrow-back" size={16} color={colors.text} /></Pressable>
                <Pressable accessibilityLabel="Move reference up" style={styles.smallControl} onPress={() => nudgeOverlay(0, -12)}><Ionicons name="arrow-up" size={16} color={colors.text} /></Pressable>
                <Pressable accessibilityLabel="Move reference down" style={styles.smallControl} onPress={() => nudgeOverlay(0, 12)}><Ionicons name="arrow-down" size={16} color={colors.text} /></Pressable>
                <Pressable accessibilityLabel="Move reference right" style={styles.smallControl} onPress={() => nudgeOverlay(12, 0)}><Ionicons name="arrow-forward" size={16} color={colors.text} /></Pressable>
              </View>
              <View onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)} style={styles.sliderTrack} {...opacityResponder.panHandlers}>
                <View style={[styles.sliderFill, { width: `${overlayOpacity * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${overlayOpacity * 100}%` }]} />
              </View>
            </View>
          ) : <Text style={styles.status}>{referenceUri ? 'Controls hidden · drag or pinch the reference' : 'Add a reference photo from Home to align your pose.'}</Text>}
          {captureError ? <Text style={styles.captureError}>{captureError}</Text> : null}
          {capturedUri ? <Text style={styles.captureSuccess}>Photo captured and overlay excluded.</Text> : null}
          <Pressable accessibilityLabel="Capture photo" accessibilityState={{ busy: isCapturing }} hitSlop={8} onPress={capturePhoto} disabled={!isCameraReady || isCapturing} style={[styles.captureButton, (!isCameraReady || isCapturing) && styles.captureButtonDisabled]}>
            {isCapturing ? <ActivityIndicator color={colors.background} /> : null}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  permissionState: { flex: 1, backgroundColor: '#050607', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  container: { flex: 1, paddingHorizontal: spacing.md },
  topBar: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  title: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  controlButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#131519DD', borderWidth: 1, borderColor: '#FFFFFF16', alignItems: 'center', justifyContent: 'center' },
  zoomButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#131519DD', borderWidth: 1, borderColor: '#FFFFFF16', alignItems: 'center', justifyContent: 'center' },
  zoomButtonText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  zoomButtonTextActive: { color: colors.background },
  pressed: { opacity: 0.68 },
  controlButtonActive: { backgroundColor: colors.accent },
  preview: { flex: 1, borderRadius: radii.lg, backgroundColor: '#0E1013', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  referenceOverlayContainer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  referenceOverlay: { width: '78%', height: '62%' },
  referenceBoundary: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  previewText: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: spacing.md },
  previewHint: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  permissionButton: { marginTop: spacing.lg, backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radii.pill },
  permissionButtonLabel: { color: colors.background, fontWeight: '700', fontSize: 15 },
  cancelLabel: { color: colors.textMuted, marginTop: spacing.lg, fontSize: 14 },
  bottomBar: { minHeight: 154, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingTop: spacing.sm },
  status: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  captureButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.text, borderWidth: 5, borderColor: colors.accent, shadowColor: colors.accentStrong, shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  captureButtonDisabled: { opacity: 0.45 },
  captureError: { color: '#E89B8F', fontSize: 12, textAlign: 'center' },
  captureSuccess: { color: '#B7E6C1', fontSize: 12, textAlign: 'center' },
  cameraLoading: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#101215' },
  cameraPaused: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#101215' },
  loadingLabel: { color: colors.textMuted, fontSize: 13, marginTop: spacing.sm },
  overlayError: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  overlayErrorText: { color: colors.text, backgroundColor: '#17191DCC', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.pill, fontSize: 12 },
  overlayControls: { width: '100%', paddingHorizontal: spacing.sm },
  gestureHint: { color: colors.textSubtle, fontSize: 11, textAlign: 'center', marginBottom: spacing.sm },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  nudgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  controlLabel: { flex: 1, color: colors.text, fontSize: 12, fontWeight: '600' },
  smallControl: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#17191DCC', alignItems: 'center', justifyContent: 'center' },
  smallControlActive: { backgroundColor: colors.accent },
  sliderTrack: { height: 24, justifyContent: 'center', backgroundColor: '#17191DCC', borderRadius: 12, overflow: 'hidden' },
  sliderFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.accent, opacity: 0.75 },
  sliderThumb: { position: 'absolute', width: 18, height: 18, marginLeft: -9, borderRadius: 9, backgroundColor: colors.text, borderWidth: 2, borderColor: colors.accent },
});
