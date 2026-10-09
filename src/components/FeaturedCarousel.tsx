import { useCart } from '@/context/CartContext';
import { fmt } from '@/lib/format';
import { colors, font, radius, shadow } from '@/lib/theme';
import type { MenuItem } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

const AUTOPLAY_MS = 4500;
const GAP = 14;

export function FeaturedCarousel({ items }: { items: MenuItem[] }) {
  const { addItem } = useCart();
  const { width } = useWindowDimensions();
  const cardW = Math.min(width * 0.62, 260);
  const step = cardW + GAP;
  const listRef = useRef<FlatList<MenuItem>>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (resume.current) clearTimeout(resume.current);
    timer.current = null;
  }, []);

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (items.length <= 1) return;
    timer.current = setInterval(() => {
      const next = (indexRef.current + 1) % items.length;
      indexRef.current = next;
      setIndex(next);
      listRef.current?.scrollToOffset({ offset: next * step, animated: true });
    }, AUTOPLAY_MS);
  }, [items.length, step]);

  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
    start();
    return stop;
  }, [start, stop]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.min(items.length - 1, Math.max(0, Math.round(e.nativeEvent.contentOffset.x / step)));
    indexRef.current = i;
    setIndex(i);
  };

  // Pause autoplay while the user is swiping, resume shortly after
  const onTouch = () => {
    stop();
    resume.current = setTimeout(start, AUTOPLAY_MS);
  };

  if (!items.length) {
    return <Text style={styles.empty}>No featured items yet.</Text>;
  }

  return (
    <View>
      <FlatList
        ref={listRef}
        data={items}
        horizontal
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: GAP }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={onTouch}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { width: cardW }]}
            onPress={() => addItem(item.name, item.price, item.image_url || '')}
          >
            <Image source={{ uri: item.image_url || undefined }} style={styles.img} contentFit="cover" transition={150} />
            <View style={styles.body}>
              <View style={styles.badge}>
                <Ionicons name="star" size={10} color={colors.brand} />
                <Text style={styles.badgeText}>Fan fave</Text>
              </View>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <View style={styles.foot}>
                <Text style={styles.price}>{fmt(item.price)}</Text>
                <View style={styles.add}>
                  <Ionicons name="add" size={18} color="#fff" />
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
      {items.length > 1 && (
        <View style={styles.dots}>
          {items.map((it, i) => (
            <Pressable
              key={it.id}
              hitSlop={8}
              onPress={() => {
                indexRef.current = i;
                setIndex(i);
                listRef.current?.scrollToOffset({ offset: i * step, animated: true });
              }}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.inkLight, paddingHorizontal: 20, paddingVertical: 10 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  img: { width: '100%', height: 150, backgroundColor: colors.placeholder },
  body: { padding: 14 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  badgeText: { fontFamily: font.bold, fontSize: 10, color: colors.brand, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontFamily: font.bold, fontSize: 15, color: colors.ink, minHeight: 40 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  price: { fontFamily: font.extra, fontSize: 15, color: colors.brand },
  add: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 18, backgroundColor: colors.brand },
});
