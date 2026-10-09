import { useData } from '@/context/DataContext';
import { colors, font, radius, shadow } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function Hero({ onOrder }: { onOrder: () => void }) {
  const { homepage: h } = useData();
  return (
    <View style={styles.hero}>
      <Image source={{ uri: h.hero_image_url }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      <LinearGradient
        colors={['rgba(26,10,0,0.05)', 'rgba(26,10,0,0.35)', 'rgba(26,10,0,0.88)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.tag}>
          <View style={styles.dot} />
          <Text style={styles.tagText}>{h.hero_tag}</Text>
        </View>
        <Text style={styles.title}>{h.hero_title}</Text>
        <Text style={styles.sub}>{h.hero_sub}</Text>
        <View style={styles.row}>
          <View style={styles.min}>
            <Ionicons name="time-outline" size={15} color="#fff" />
            <Text style={styles.minText}>{h.delivery_eta}</Text>
          </View>
          <Pressable style={styles.btnHero} onPress={onOrder}>
            <Text style={styles.btnHeroText}>Order now</Text>
          </Pressable>
          <Pressable style={styles.btnGhost} onPress={() => router.push('/cart')}>
            <Text style={styles.btnGhostText}>View cart</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 460, justifyContent: 'flex-end', backgroundColor: colors.placeholder },
  content: { padding: 20, paddingBottom: 24 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3DDC84' },
  tagText: { color: '#fff', fontFamily: font.semi, fontSize: 12 },
  title: { color: '#fff', fontFamily: font.extra, fontSize: 52, letterSpacing: -2, lineHeight: 56, marginBottom: 6 },
  sub: { color: 'rgba(255,255,255,0.88)', fontFamily: font.regular, fontSize: 14, lineHeight: 21, marginBottom: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  min: { flexDirection: 'row', alignItems: 'center', gap: 5, marginRight: 2 },
  minText: { color: '#fff', fontFamily: font.semi, fontSize: 12 },
  btnHero: {
    flex: 1,
    backgroundColor: colors.brand,
    borderRadius: radius.full,
    paddingVertical: 13,
    alignItems: 'center',
    ...shadow.cta,
  },
  btnHeroText: { color: '#fff', fontFamily: font.bold, fontSize: 14 },
  btnGhost: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1.5,
    borderRadius: radius.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnGhostText: { color: '#fff', fontFamily: font.bold, fontSize: 14 },
});
