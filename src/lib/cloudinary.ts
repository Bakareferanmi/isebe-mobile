import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_CLOUD, CLOUDINARY_PRESET } from './firebase';

const MAX_BYTES = 3 * 1024 * 1024;

export type PickedImage = { uri: string; name: string; type: string; size?: number };

export async function pickImage(): Promise<PickedImage | null> {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: false,
  });
  if (res.canceled || !res.assets?.length) return null;
  const a = res.assets[0];
  return {
    uri: a.uri,
    name: a.fileName || `upload-${Date.now()}.jpg`,
    type: a.mimeType || 'image/jpeg',
    size: a.fileSize,
  };
}

export async function uploadToCloudinary(img: PickedImage, folder: string): Promise<string> {
  if (img.size && img.size > MAX_BYTES) throw new Error('Image too large (max 3 MB)');
  const fd = new FormData();
  // React Native's FormData accepts this {uri,name,type} shape for files
  fd.append('file', { uri: img.uri, name: img.name, type: img.type } as any);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  fd.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url as string;
}
