import { useToast } from '@/context/ToastContext';
import { uploadToCloudinary, type PickedImage } from '@/lib/cloudinary';
import { db } from '@/lib/firebase';
import { fmt } from '@/lib/format';
import { CATEGORIES, colors, font, radius, shadow } from '@/lib/theme';
import type { MenuItem } from '@/lib/types';
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

const CATS = CATEGORIES.filter((c) => c.key !== 'all');

export function MenuTab() {
  const toast = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('mains');
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [picked, setPicked] = useState<PickedImage | null>(null);
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(query(collection(db, 'menu_items'), orderBy('sort_order', 'asc')));
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, 'id'>) })));
    } catch {
      try {
        // Index may not exist yet — fall back to unordered
        const snap = await getDocs(collection(db, 'menu_items'));
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, 'id'>) })));
      } catch {}
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const clear = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setCategory('mains');
    setDesc('');
    setImgUrl('');
    setPicked(null);
    setFeatured(false);
  };

  const edit = (it: MenuItem) => {
    setEditingId(it.id);
    setName(it.name || '');
    setPrice(String(it.price ?? ''));
    setCategory(it.category || 'mains');
    setDesc(it.description || '');
    setImgUrl(it.image_url || '');
    setPicked(null);
    setFeatured(!!it.featured);
  };

  const save = async () => {
    const p = parseInt(price, 10);
    if (!name.trim() || !p) return toast('Name and price required', 'error');
    setSaving(true);
    try {
      let image_url = imgUrl.trim();
      if (picked) image_url = await uploadToCloudinary(picked, 'isebe/menu');
      const payload: Record<string, any> = {
        name: name.trim(),
        price: p,
        category,
        description: desc.trim(),
        featured,
        image_url,
        active: true,
        updated_at: serverTimestamp(),
      };
      if (editingId) {
        await updateDoc(doc(db, 'menu_items', editingId), payload);
        toast('Item updated ✓', 'success');
      } else {
        await addDoc(collection(db, 'menu_items'), { ...payload, sort_order: Date.now() });
        toast('Item added ✓', 'success');
      }
      clear();
      load();
    } catch (e: any) {
      toast('Error: ' + e.message, 'error');
    }
    setSaving(false);
  };

  const remove = (it: MenuItem) =>
    Alert.alert('Delete this item?', `${it.name} will be removed. This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'menu_items', it.id));
            toast('Item deleted', 'success');
            load();
          } catch (e: any) {
            toast('Error: ' + e.message, 'error');
          }
        },
      },
    ]);

  return (
    <View>
      <SecTitle title="Menu Items" sub="Add, edit, or remove dishes" />

      <View style={st.form}>
        <Text style={s.secTitle}>{editingId ? 'Edit Item' : 'Add / Edit Item'}</Text>
        <View style={{ height: 12 }} />
        <Field label="Item name" value={name} onChangeText={setName} placeholder="Jollof Rice & Chicken" />
        <Field label="Price (₦)" keyboardType="number-pad" value={price} onChangeText={setPrice} placeholder="5000" />
        <Text style={s.label}>Category</Text>
        <View style={st.chips}>
          {CATS.map((c) => (
            <Pressable
              key={c.key}
              onPress={() => setCategory(c.key)}
              style={[st.chip, category === c.key && st.chipOn]}
            >
              <Text style={[st.chipText, category === c.key && { color: '#fff' }]}>
                {c.icon} {c.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Field label="Short description" value={desc} onChangeText={setDesc} placeholder="Smoky West African jollof rice with tender chicken" />
        <ImageField
          label="Image"
          uri={picked?.uri || imgUrl}
          onPicked={setPicked}
        />
        <Field
          label="Or paste image URL"
          autoCapitalize="none"
          keyboardType="url"
          value={imgUrl}
          onChangeText={(v) => {
            setImgUrl(v);
            setPicked(null);
          }}
          placeholder="https://images.unsplash.com/…"
        />
        <SwitchRow label="Featured (show in fan favourites)" value={featured} onChange={setFeatured} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Btn
            title={editingId ? 'Update item' : 'Add item'}
            icon="add"
            busy={saving}
            onPress={save}
            style={{ flex: 1 }}
          />
          <Btn title="Clear" variant="ghost" onPress={clear} />
        </View>
      </View>

      <View style={{ height: 22 }} />
      <SecTitle title="All items" />
      {items.length === 0 && <Text style={st.empty}>No items yet. Add one above.</Text>}
      <View style={{ gap: 10 }}>
        {items.map((it) => (
          <View key={it.id} style={st.row}>
            <Image source={{ uri: it.image_url || undefined }} style={st.img} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={st.name} numberOfLines={1}>{it.name}</Text>
              <Text style={st.cat}>
                {it.category}
                {it.featured ? ' · ⭐ Featured' : ''}
              </Text>
              <Text style={st.price}>{fmt(it.price)}</Text>
            </View>
            <Pressable style={st.icon} onPress={() => edit(it)} hitSlop={6}>
              <Ionicons name="create-outline" size={18} color={colors.inkMid} />
            </Pressable>
            <Pressable style={[st.icon, { borderColor: '#F5C6C2' }]} onPress={() => remove(it)} hitSlop={6}>
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontFamily: font.semi, fontSize: 12, color: colors.ink },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.inkLight },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: radius.md, padding: 10, ...shadow.soft },
  img: { width: 52, height: 52, borderRadius: radius.sm, backgroundColor: colors.placeholder },
  name: { fontFamily: font.bold, fontSize: 14, color: colors.ink },
  cat: { fontFamily: font.regular, fontSize: 11, color: colors.inkMid, textTransform: 'capitalize' },
  price: { fontFamily: font.extra, fontSize: 13, color: colors.brand },
  icon: { width: 36, height: 36, borderRadius: 11, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});
