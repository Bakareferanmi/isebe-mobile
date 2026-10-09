import { useCart } from '@/context/CartContext';
import { fmt } from '@/lib/format';
import { colors, font, radius, shadow } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { cart, total, addItem, removeItem, checkout } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={styles.handle} />
      <View style={styles.head}>
        <Text style={styles.title}>Your cart</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.ink} />
        </Pressable>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(i) => i.name}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, flexGrow: 1 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={52} color={colors.inkLight} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Add something delicious!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.img || undefined }} style={styles.img} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.price}>{fmt(item.price)} each</Text>
            </View>
            <View style={styles.qtyRow}>
              <Pressable style={styles.qbtn} onPress={() => removeItem(item.name)}>
                <Ionicons name="remove" size={16} color={colors.ink} />
              </Pressable>
              <Text style={styles.qnum}>{item.qty}</Text>
              <Pressable style={styles.qbtn} onPress={() => addItem(item.name, item.price, item.img)}>
                <Ionicons name="add" size={16} color={colors.ink} />
              </Pressable>
            </View>
          </View>
        )}
      />

      {cart.length > 0 && (
        <View style={[styles.foot, { paddingBottom: 16 + insets.bottom }]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>{fmt(total)}</Text>
          </View>
          <Pressable style={styles.cta} onPress={checkout}>
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.ctaText}>Place order via WhatsApp</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginTop: 8 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontFamily: font.extra, fontSize: 22, letterSpacing: -0.5, color: colors.ink },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  img: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.placeholder },
  name: { fontFamily: font.bold, fontSize: 14, color: colors.ink },
  price: { fontFamily: font.regular, fontSize: 12, color: colors.inkMid, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qbtn: { width: 30, height: 30, borderRadius: 9, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  qnum: { fontFamily: font.bold, fontSize: 14, color: colors.ink, minWidth: 16, textAlign: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 60 },
  emptyTitle: { fontFamily: font.bold, fontSize: 16, color: colors.ink, marginTop: 6 },
  emptySub: { fontFamily: font.regular, fontSize: 13, color: colors.inkLight },
  foot: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: font.semi, fontSize: 15, color: colors.ink },
  totalVal: { fontFamily: font.extra, fontSize: 18, color: colors.brand },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, backgroundColor: colors.brand, borderRadius: radius.full, paddingVertical: 16, ...shadow.cta },
  ctaText: { color: '#fff', fontFamily: font.bold, fontSize: 15 },
});
