import { fmtDate } from '@/lib/format';
import { colors, font, radius, shadow } from '@/lib/theme';
import type { BlogPost } from '@/lib/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: '/blog/[id]', params: { id: post.id } })}
    >
      {!!post.cover_image_url && (
        <Image source={{ uri: post.cover_image_url }} style={styles.img} contentFit="cover" transition={150} />
      )}
      <View style={styles.body}>
        <Text style={styles.date}>{fmtDate(post.published_at || post.created_at)}</Text>
        <Text style={styles.title}>{post.title}</Text>
        {!!post.excerpt && <Text style={styles.excerpt} numberOfLines={3}>{post.excerpt}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  img: { width: '100%', height: 170, backgroundColor: colors.placeholder },
  body: { padding: 16 },
  date: { fontFamily: font.semi, fontSize: 11, color: colors.inkLight, marginBottom: 4 },
  title: { fontFamily: font.extra, fontSize: 16, color: colors.ink, lineHeight: 21, marginBottom: 5 },
  excerpt: { fontFamily: font.regular, fontSize: 13, color: colors.inkMid, lineHeight: 19 },
});
