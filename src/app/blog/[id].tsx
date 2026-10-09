import { useData } from '@/context/DataContext';
import { fmtDate } from '@/lib/format';
import { colors, font } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlogReader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts } = useData();
  const insets = useSafeAreaInsets();
  const post = posts.find((p) => String(p.id) === String(id));

  return (
    <View style={styles.root}>
      <View style={[styles.top, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
      {post ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}>
          {!!post.cover_image_url && (
            <Image source={{ uri: post.cover_image_url }} style={styles.cover} contentFit="cover" />
          )}
          <View style={styles.body}>
            <Text style={styles.date}>{fmtDate(post.published_at || post.created_at)}</Text>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.missing}>This post could not be found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  top: { paddingHorizontal: 14, paddingBottom: 6, backgroundColor: colors.surface },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { fontFamily: font.semi, fontSize: 14, color: colors.ink },
  cover: { width: '100%', height: 240, backgroundColor: colors.placeholder },
  body: { padding: 20 },
  date: { fontFamily: font.semi, fontSize: 12, color: colors.inkLight, marginBottom: 6 },
  title: { fontFamily: font.extra, fontSize: 28, letterSpacing: -1, lineHeight: 33, color: colors.ink, marginBottom: 16 },
  content: { fontFamily: font.regular, fontSize: 15, lineHeight: 25, color: colors.inkMid },
  missing: { fontFamily: font.regular, fontSize: 14, color: colors.inkLight, padding: 20 },
});
