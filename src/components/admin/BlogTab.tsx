import { useToast } from '@/context/ToastContext';
import { uploadToCloudinary, type PickedImage } from '@/lib/cloudinary';
import { db } from '@/lib/firebase';
import { colors, font, radius, shadow } from '@/lib/theme';
import type { BlogPost } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Btn, Field, ImageField, SecTitle, SwitchRow, s } from './ui';

export function BlogTab() {
  const toast = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [wasPublished, setWasPublished] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [picked, setPicked] = useState<PickedImage | null>(null);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(query(collection(db, 'blog_posts'), orderBy('created_at', 'desc')));
      setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) })));
    } catch {
      try {
        const snap = await getDocs(collection(db, 'blog_posts'));
        setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) })));
      } catch {
        setPosts([]);
      }
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const clear = () => {
    setEditingId(null);
    setWasPublished(false);
    setTitle('');
    setExcerpt('');
    setContent('');
    setImgUrl('');
    setPicked(null);
    setPublished(true);
  };

  const edit = (p: BlogPost) => {
    setEditingId(p.id);
    setWasPublished(!!p.published);
    setTitle(p.title || '');
    setExcerpt(p.excerpt || '');
    setContent(p.content || '');
    setImgUrl(p.cover_image_url || '');
    setPicked(null);
    setPublished(!!p.published);
  };

  const save = async () => {
    if (!title.trim() || !content.trim()) return toast('Title and content required', 'error');
    setSaving(true);
    try {
      let cover = imgUrl.trim();
      if (picked) cover = await uploadToCloudinary(picked, 'isebe/blog');
      const payload: Record<string, any> = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        cover_image_url: cover,
        published,
        updated_at: serverTimestamp(),
      };
      // Stamp published_at the moment a post first goes live (not on every edit)
      if (published && (!editingId || !wasPublished)) payload.published_at = serverTimestamp();

      if (editingId) {
        await updateDoc(doc(db, 'blog_posts', editingId), payload);
        toast('Post updated ✓', 'success');
      } else {
        await addDoc(collection(db, 'blog_posts'), { ...payload, created_at: serverTimestamp() });
        toast('Post saved ✓', 'success');
      }
      clear();
      load();
    } catch (e: any) {
      toast('Error: ' + e.message, 'error');
    }
    setSaving(false);
  };

  const remove = (p: BlogPost) =>
    Alert.alert('Delete this post?', `"${p.title}" will be removed. This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'blog_posts', p.id));
            toast('Post deleted', 'success');
            load();
          } catch (e: any) {
            toast('Error: ' + e.message, 'error');
          }
        },
      },
    ]);

  return (
    <View>
      <SecTitle title="Blog" sub="Write posts and publish them to customers" />

      <View style={st.form}>
        <Text style={s.secTitle}>{editingId ? 'Edit Post' : 'New Post'}</Text>
        <View style={{ height: 12 }} />
        <Field label="Title" value={title} onChangeText={setTitle} placeholder="The secret behind our jollof" />
        <Field label="Excerpt" multiline value={excerpt} onChangeText={setExcerpt} placeholder="A quick teaser for this post…" />
        <ImageField label="Cover image" uri={picked?.uri || imgUrl} onPicked={setPicked} />
        <Field
          label="Or paste cover image URL"
          autoCapitalize="none"
          keyboardType="url"
          value={imgUrl}
          onChangeText={(v) => {
            setImgUrl(v);
            setPicked(null);
          }}
          placeholder="https://images.unsplash.com/…"
        />
        <Field label="Content" multiline style={{ minHeight: 180 }} value={content} onChangeText={setContent} placeholder="Write your post here…" />
        <SwitchRow label="Published (visible to customers)" value={published} onChange={setPublished} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Btn
            title={editingId ? 'Update post' : 'Publish post'}
            icon="add"
            busy={saving}
            onPress={save}
            style={{ flex: 1 }}
          />
          <Btn title="Clear" variant="ghost" onPress={clear} />
        </View>
      </View>

      <View style={{ height: 22 }} />
      <SecTitle title="All posts" sub="Tap edit to modify, delete to remove" />
      {posts.length === 0 && <Text style={st.empty}>No posts yet. Write one above.</Text>}
      <View style={{ gap: 10 }}>
        {posts.map((p) => (
          <View key={p.id} style={st.row}>
            {p.cover_image_url ? (
              <Image source={{ uri: p.cover_image_url }} style={st.img} contentFit="cover" />
            ) : (
              <View style={[st.img, { alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="book-outline" size={20} color={colors.inkLight} />
              </View>
            )}
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={st.name} numberOfLines={2}>{p.title}</Text>
              <View style={[st.pill, p.published ? st.live : st.draft]}>
                <Text style={[st.pillText, { color: p.published ? colors.success : colors.inkMid }]}>
                  {p.published ? 'Published' : 'Draft'}
                </Text>
              </View>
            </View>
            <Pressable style={st.icon} onPress={() => edit(p)} hitSlop={6}>
              <Ionicons name="create-outline" size={18} color={colors.inkMid} />
            </Pressable>
            <Pressable style={[st.icon, { borderColor: '#F5C6C2' }]} onPress={() => remove(p)} hitSlop={6}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  form: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, ...shadow.soft },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.inkLight },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: radius.md, padding: 10, ...shadow.soft },
  img: { width: 52, height: 52, borderRadius: radius.sm, backgroundColor: colors.placeholder },
  name: { fontFamily: font.bold, fontSize: 14, color: colors.ink },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  live: { backgroundColor: '#E6F4EA' },
  draft: { backgroundColor: colors.surface2 },
  pillText: { fontFamily: font.semi, fontSize: 10 },
  icon: { width: 36, height: 36, borderRadius: 11, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});
