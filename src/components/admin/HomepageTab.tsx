import { useToast } from '@/context/ToastContext';
import { uploadToCloudinary, type PickedImage } from '@/lib/cloudinary';
import { db } from '@/lib/firebase';
import type { Homepage } from '@/lib/types';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Btn, Field, ImageField, SecTitle } from './ui';

const EMPTY: Required<Homepage> = {
  hero_image_url: '', hero_title: '', hero_sub: '', hero_tag: '', delivery_eta: '',
  menu_sub: '', loc_short: '', loc_full: '', loc_city: '', phone: '', whatsapp_num: '',
};

export function HomepageTab() {
  const toast = useToast();
  const [f, setF] = useState<Required<Homepage>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof Homepage) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    getDoc(doc(db, 'site', 'homepage'))
      .then((snap) => snap.exists() && setF({ ...EMPTY, ...(snap.data() as Homepage) }))
      .catch(() => {});
  }, []);

  const uploadHero = async (img: PickedImage) => {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(img, 'isebe/hero');
      await setDoc(
        doc(db, 'site', 'homepage'),
        { hero_image_url: url, updated_at: serverTimestamp() },
        { merge: true },
      );
      setF((p) => ({ ...p, hero_image_url: url }));
      toast('Hero image uploaded ✓', 'success');
    } catch (e: any) {
      toast('Upload failed: ' + e.message, 'error');
    }
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { hero_image_url, ...rest } = f;
      await setDoc(
        doc(db, 'site', 'homepage'),
        { ...rest, updated_at: serverTimestamp() },
        { merge: true },
      );
      toast('Homepage saved ✓', 'success');
    } catch (e: any) {
      toast('Save failed: ' + e.message, 'error');
    }
    setSaving(false);
  };

  return (
    <View>
      <SecTitle title="Homepage Content" sub="Changes appear instantly for customers" />
      <ImageField label="Hero Image" uri={f.hero_image_url} onPicked={uploadHero} busy={uploading} />
      <Field label="Hero Title" value={f.hero_title} onChangeText={set('hero_title')} placeholder="ISEBE" />
      <Field label="Hero Subtitle" multiline value={f.hero_sub} onChangeText={set('hero_sub')} placeholder="Best Jollof · Suya · Shawarma" />
      <Field label="Status Tag (e.g. Open now · Yaba)" value={f.hero_tag} onChangeText={set('hero_tag')} placeholder="Open now · Yaba, Lagos" />
      <Field label="Delivery ETA" value={f.delivery_eta} onChangeText={set('delivery_eta')} placeholder="20–30 min" />
      <Field label="Menu Subtitle" value={f.menu_sub} onChangeText={set('menu_sub')} placeholder="Everything we're cooking today" />
      <Field label="Address (short)" value={f.loc_short} onChangeText={set('loc_short')} placeholder="12 Herbert Macaulay Way, Yaba, Lagos" />
      <Field label="Full Address" multiline value={f.loc_full} onChangeText={set('loc_full')} placeholder="12 Herbert Macaulay Way, Yaba, Lagos 101212…" />
      <Field label="City Label" value={f.loc_city} onChangeText={set('loc_city')} placeholder="Yaba, Lagos" />
      <Field label="Phone Number" keyboardType="phone-pad" value={f.phone} onChangeText={set('phone')} placeholder="+234 800 000 0000" />
      <Field label="WhatsApp Order Number (with country code)" keyboardType="number-pad" value={f.whatsapp_num} onChangeText={set('whatsapp_num')} placeholder="2348000000000" />
      <Btn title="Save homepage" icon="save-outline" busy={saving} onPress={save} />
    </View>
  );
}
