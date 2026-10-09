import { useCart } from '@/context/CartContext';
import { fmt } from '@/lib/format';
import { colors, font, radius, shadow } from '@/lib/theme';
import type { MenuItem } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function MenuRow({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const add = () => addItem(item.name, item.price, item.image_url || '');
  return (
    <Pressable style={styles.row} onPress={add}>
      <Image source={{ uri: item.image_url || undefined }} style={styles.img} contentFit="cover" transition={150} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {!!item.description && <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>}
        <Text style={styles.price}>{fmt(item.price)}</Text>
      </View>
      <Pressable style={styles.add} onPress={add} hitSlop={6}>
        <Ionicons name="add" size={20} color="#fff" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 10,
    ...shadow.soft,
  },
  img: { width: 76, height: 76, borderRadius: radius.sm, backgroundColor: colors.placeholder },
  info: { flex: 1 },
  name: { fontFamily: font.bold, fontSize: 14, color: colors.ink },
  desc: { fontFamily: font.regular, fontSize: 12, color: colors.inkMid, marginTop: 2 },
  price: { fontFamily: font.extra, fontSize: 15, color: colors.brand, marginTop: 4 },
  add: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
});
