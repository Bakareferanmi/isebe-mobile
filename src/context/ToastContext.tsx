import { colors, font, radius } from '@/lib/theme';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = '' | 'success' | 'error';
type ToastFn = (msg: string, type?: ToastType) => void;

const Ctx = createContext<ToastFn>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('');
  const [type, setType] = useState<ToastType>('');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const show = useCallback<ToastFn>(
    (m, t = '') => {
      setMsg(m);
      setType(t);
      if (timer.current) clearTimeout(timer.current);
      Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      }, 2200);
    },
    [opacity],
  );

  return (
    <Ctx.Provider value={show}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          { opacity, top: insets.top + 12 },
          type === 'success' && { backgroundColor: colors.success },
          type === 'error' && { backgroundColor: colors.danger },
        ]}
      >
        <Text style={styles.text}>{msg}</Text>
      </Animated.View>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '90%',
    backgroundColor: colors.ink,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.full,
    zIndex: 999,
  },
  text: { color: '#fff', fontFamily: font.semi, fontSize: 13 },
});
