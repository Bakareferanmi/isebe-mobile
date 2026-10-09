import { pickImage, type PickedImage } from '@/lib/cloudinary';
import { colors, font, radius } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

export function Field({ label, multiline, style, ...rest }: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.inkLight}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[s.input, multiline && { minHeight: 80, paddingTop: 12 }, style]}
        {...rest}
      />
    </View>
  );
}

export function Btn({
  title,
  onPress,
  busy,
  variant = 'dark',
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  busy?: boolean;
  variant?: 'dark' | 'brand' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: object;
}) {
  const bg = variant === 'brand' ? colors.brand : variant === 'dark' ? colors.ink : colors.white;
  const fg = variant === 'ghost' ? colors.inkMid : '#fff';
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={[
        s.btn,
        { backgroundColor: bg, opacity: busy ? 0.7 : 1 },
        variant === 'ghost' && { borderWidth: 1.5, borderColor: colors.border },
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={16} color={fg} />}
          <Text style={[s.btnText, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={s.switchRow}>
      <Text style={[s.label, { marginBottom: 0, flex: 1 }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.brand, false: colors.border }}
        thumbColor="#fff"
      />
    </View>
  );
}

// Preview + "pick from gallery". The upload itself happens in the tab's save handler.
export function ImageField({
  label,
  uri,
  onPicked,
  busy,
  hint = 'PNG, JPG or WebP — max 3 MB',
}: {
  label: string;
  uri?: string;
  onPicked: (img: PickedImage) => void;
  busy?: boolean;
  hint?: string;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      {!!uri && <Image source={{ uri }} style={s.preview} contentFit="cover" />}
      <Pressable
        style={s.zone}
        disabled={busy}
        onPress={async () => {
          const img = await pickImage();
          if (img) onPicked(img);
        }}
      >
        {busy ? (
          <ActivityIndicator color={colors.brand} />
        ) : (
          <>
            <Ionicons name="image-outline" size={26} color={colors.inkLight} />
            <Text style={s.zoneText}>{uri ? 'Change image' : 'Choose from gallery'}</Text>
            <Text style={s.zoneHint}>{hint}</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

export function SecTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.secTitle}>{title}</Text>
      {!!sub && <Text style={s.secSub}>{sub}</Text>}
    </View>
  );
}

export function StatCard({ num, label, small }: { num: string | number; label: string; small?: boolean }) {
  return (
    <View style={s.stat}>
      <Text style={[s.statNum, small && { fontSize: 13, color: colors.inkMid, fontFamily: font.semi }]}>{num}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

export const s = StyleSheet.create({
  label: { fontFamily: font.semi, fontSize: 12, color: colors.inkMid, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.ink,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.full,
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  btnText: { fontFamily: font.bold, fontSize: 15 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  preview: { width: '100%', height: 150, borderRadius: radius.md, marginBottom: 8, backgroundColor: colors.placeholder },
  zone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.surface,
  },
  zoneText: { fontFamily: font.semi, fontSize: 13, color: colors.ink },
  zoneHint: { fontFamily: font.regular, fontSize: 11, color: colors.inkLight },
  secTitle: { fontFamily: font.extra, fontSize: 18, letterSpacing: -0.4, color: colors.ink },
  secSub: { fontFamily: font.regular, fontSize: 12, color: colors.inkMid, marginTop: 2 },
  stat: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.border },
  statNum: { fontFamily: font.extra, fontSize: 28, letterSpacing: -1, color: colors.brand },
  statLabel: { fontFamily: font.medium, fontSize: 12, color: colors.inkLight, marginTop: 2 },
});
