import { BlogCard } from '@/components/BlogCard';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { Hero } from '@/components/Hero';
import { MenuRow } from '@/components/MenuRow';
import { useCart } from '@/context/CartContext';
import { useData } from '@/context/DataContext';
import { trackCartOpened } from '@/lib/analytics';
import { fmt } from '@/lib/format';
import { CATEGORIES, colors, font, radius, shadow } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
  const { homepage: h, menu, featured, posts, loading } = useData();
  const { count, total } = useCart();
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollView>(null);
  const menuY = useRef(0);
  const [cat, setCat] = useState<string>('all');

  // Triple-tap the logo to open the admin panel (same as the web app)
  const taps = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onLogoTap = () => {
    taps.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => (taps.current = 0), 600);
    if (taps.current >= 3) {
      taps.current = 0;
      router.push('/admin');
    }
  };

  const openCart = () => {
    trackCartOpened();
    router.push('/cart');
  };

  const visible = cat === 'all' ? menu : menu.filter((i) => i.category === cat);

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
      >
        {/* Top bar */}
        <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={onLogoTap} accessibilityLabel="Isebe">
            <Image source={require('../../assets/logo.png')} style={styles.logo} contentFit="contain" />
          </Pressable>
          <Pressable style={styles.cartBtn} onPress={openCart}>
            <Ionicons name="cart-outline" size={17} color={colors.ink} />
            <Text style={styles.cartBtnText}>Cart</Text>
            {count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <Hero onOrder={() => scroll.current?.scrollTo({ y: menuY.current - 8, animated: true })} />

        {/* Featured */}
        <View style={styles.sec}>
          <View style={styles.secHd}>
            <Text style={styles.secTitle}>🔥 Fan favourites</Text>
            <Pressable onPress={() => scroll.current?.scrollTo({ y: menuY.current - 8, animated: true })}>
              <Text style={styles.secLink}>See all ›</Text>
            </Pressable>
          </View>
          <Text style={styles.secSub}>Our most-ordered dishes this week</Text>
        </View>
        {loading ? <Text style={styles.muted}>Loading…</Text> : <FeaturedCarousel items={featured} />}

        {/* Menu */}
        <View
          style={styles.sec}
          onLayout={(e) => (menuY.current = e.nativeEvent.layout.y)}
        >
          <Text style={styles.secTitle}>Full menu</Text>
          <Text style={styles.secSub}>{h.menu_sub}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cats}
        >
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.key}
              onPress={() => setCat(c.key)}
              style={[styles.cat, cat === c.key && styles.catActive]}
            >
              <Text style={[styles.catText, cat === c.key && styles.catTextActive]}>
                {c.icon} {c.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.list}>
          {visible.length ? (
            visible.map((i) => <MenuRow key={i.id} item={i} />)
          ) : (
            <Text style={styles.muted}>Nothing here yet.</Text>
          )}
        </View>

        {/* Location */}
        <View style={styles.sec}>
          <Text style={[styles.secTitle, { marginBottom: 14 }]}>Our location</Text>
          <View style={styles.mapFallback}>
            <Ionicons name="location-outline" size={30} color={colors.brand} />
            <Text style={styles.mapText}>{h.loc_short}</Text>
          </View>
          <View style={styles.locCard}>
            <Text style={styles.locEyebrow}>ISEBE</Text>
            <Text style={styles.locCity}>{h.loc_city}</Text>
            <Text style={styles.locLabel}>Address</Text>
            <Text style={styles.locVal}>{h.loc_full}</Text>
            <View style={styles.divider} />
            <Text style={styles.locLabel}>Phone</Text>
            <Pressable onPress={() => Linking.openURL(`tel:${h.phone.replace(/\s+/g, '')}`)}>
              <Text style={[styles.locVal, { color: colors.brand }]}>{h.phone}</Text>
            </Pressable>
            <Pressable
              style={styles.waBtn}
              onPress={() => Linking.openURL(`https://wa.me/${h.whatsapp_num}`)}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
              <Text style={styles.waText}>Chat on WhatsApp</Text>
            </Pressable>
          </View>
        </View>

        {/* Blog */}
        <View style={styles.sec}>
          <Text style={styles.secTitle}>From the kitchen</Text>
          <Text style={styles.secSub}>News, recipes & behind-the-scenes from Isebe</Text>
        </View>
        <View style={styles.list}>
          {posts.length ? (
            posts.map((p) => <BlogCard key={p.id} post={p} />)
          ) : (
            <Text style={styles.muted}>No posts yet — check back soon!</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Image source={require('../../assets/logo.png')} style={styles.footLogo} contentFit="contain" />
          <Text style={styles.hours}>🕗 Mon–Sun: 8:00 AM – 10:00 PM</Text>
          <Text style={styles.copy}>© 2026 Isebe. All rights reserved.</Text>
          <View style={styles.links}>
            <Pressable onPress={() => router.push({ pathname: '/legal/[type]', params: { type: 'privacy' } })}>
              <Text style={styles.link}>Privacy Policy</Text>
            </Pressable>
            <Text style={styles.sep}>•</Text>
            <Pressable onPress={() => router.push({ pathname: '/legal/[type]', params: { type: 'terms' } })}>
              <Text style={styles.link}>Terms & Conditions</Text>
            </Pressable>
            <Text style={styles.sep}>•</Text>
            <Pressable onPress={() => router.push({ pathname: '/legal/[type]', params: { type: 'faq' } })}>
              <Text style={styles.link}>FAQ</Text>
            </Pressable>
          </View>
          <Text style={styles.powered}>
            Powered by <Text style={styles.poweredBrand}>BeepeeLabs</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Floating cart bar */}
      {count > 0 && (
        <Pressable style={[styles.float, { bottom: 20 + insets.bottom }]} onPress={openCart}>
          <Ionicons name="cart-outline" size={18} color="#fff" />
          <Text style={styles.floatText}>View cart</Text>
          <View style={styles.floatBadge}>
            <Text style={styles.floatBadgeText}>{count}</Text>
          </View>
          <View style={styles.floatDiv} />
          <Text style={styles.floatText}>{fmt(total)}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.surface,
  },
  logo: { width: 44, height: 44, borderRadius: 12 },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: radius.full,
  },
  cartBtnText: { fontFamily: font.semi, fontSize: 13, color: colors.ink },
  badge: { backgroundColor: colors.brand, minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeText: { color: '#fff', fontFamily: font.bold, fontSize: 11 },

  sec: { paddingHorizontal: 20, marginTop: 28, marginBottom: 12 },
  secHd: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secTitle: { fontFamily: font.extra, fontSize: 22, letterSpacing: -0.5, color: colors.ink },
  secLink: { fontFamily: font.semi, fontSize: 13, color: colors.brand },
  secSub: { fontFamily: font.regular, fontSize: 13, color: colors.inkMid, marginTop: 2 },
  muted: { fontFamily: font.regular, fontSize: 13, color: colors.inkLight, paddingHorizontal: 20, paddingVertical: 10 },

  cats: { paddingHorizontal: 20, gap: 8, paddingBottom: 14 },
  cat: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.full, backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1.5 },
  catActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  catText: { fontFamily: font.semi, fontSize: 13, color: colors.ink },
  catTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, gap: 12 },

  mapFallback: { height: 130, borderRadius: radius.lg, backgroundColor: colors.surface2, borderColor: colors.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 16 },
  mapText: { fontFamily: font.semi, fontSize: 13, color: colors.inkMid, textAlign: 'center' },
  locCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 18, marginTop: 12, ...shadow.card },
  locEyebrow: { fontFamily: font.bold, fontSize: 11, letterSpacing: 1.5, color: colors.brand },
  locCity: { fontFamily: font.extra, fontSize: 24, letterSpacing: -0.6, color: colors.ink, marginBottom: 14 },
  locLabel: { fontFamily: font.semi, fontSize: 11, color: colors.inkLight, textTransform: 'uppercase', letterSpacing: 0.6 },
  locVal: { fontFamily: font.medium, fontSize: 14, color: colors.ink, lineHeight: 21, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  waBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, paddingVertical: 12, borderRadius: radius.full, borderColor: colors.border, borderWidth: 1.5 },
  waText: { fontFamily: font.semi, fontSize: 13, color: colors.ink },

  footer: { alignItems: 'center', marginTop: 36, paddingHorizontal: 20, gap: 6 },
  footLogo: { width: 56, height: 56, borderRadius: 14, marginBottom: 6 },
  hours: { fontFamily: font.medium, fontSize: 13, color: colors.inkMid },
  copy: { fontFamily: font.regular, fontSize: 12, color: colors.inkLight },
  links: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 },
  link: { fontFamily: font.semi, fontSize: 12, color: colors.inkMid },
  sep: { color: colors.inkLight },
  powered: { fontFamily: font.regular, fontSize: 12, color: colors.inkLight, marginTop: 8 },
  poweredBrand: { fontFamily: font.extra, color: colors.brand },

  float: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.ink,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: radius.full,
    shadowColor: '#1A0A00',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  floatText: { color: '#fff', fontFamily: font.bold, fontSize: 14 },
  floatBadge: { backgroundColor: colors.brand, minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  floatBadgeText: { color: '#fff', fontFamily: font.bold, fontSize: 12 },
  floatDiv: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.3)' },
});
