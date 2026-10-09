import { LEGAL } from '@/data/legal';
import { colors, font } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Legal() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const insets = useSafeAreaInsets();
  const doc = LEGAL[(type as keyof typeof LEGAL) in LEGAL ? (type as keyof typeof LEGAL) : 'privacy'];

  return (
    <View style={styles.root}>
      <View style={[styles.top, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 + insets.bottom }}>
        <Text style={styles.title}>{doc.title}</Text>
        {!!doc.updated && <Text style={styles.updated}>{doc.updated}</Text>}
        {doc.sections.map((s) => (
          <View key={s.h} style={styles.section}>
            <Text style={styles.h2}>{s.h}</Text>
            {!!s.lead && <Text style={styles.p}>{s.lead}</Text>}
            {!!s.p && <Text style={styles.p}>{s.p}</Text>}
            {s.ul?.map((li) => (
              <View key={li} style={styles.li}>
                <Text style={styles.bullet}>•</Text>
                <Text style={[styles.p, { flex: 1 }]}>{li}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  top: { paddingHorizontal: 14, paddingBottom: 6 },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { fontFamily: font.semi, fontSize: 14, color: colors.ink },
  title: { fontFamily: font.extra, fontSize: 28, letterSpacing: -1, color: colors.ink },
  updated: { fontFamily: font.regular, fontSize: 12, color: colors.inkLight, marginTop: 2, marginBottom: 8 },
  section: { marginTop: 20 },
  h2: { fontFamily: font.bold, fontSize: 16, color: colors.ink, marginBottom: 6 },
  p: { fontFamily: font.regular, fontSize: 14, lineHeight: 22, color: colors.inkMid },
  li: { flexDirection: 'row', gap: 8, marginTop: 4, paddingRight: 8 },
  bullet: { color: colors.brand, fontFamily: font.bold, fontSize: 14, lineHeight: 22 },
});
