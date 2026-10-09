import { AnalyticsTab } from '@/components/admin/AnalyticsTab';
import { BlogTab } from '@/components/admin/BlogTab';
import { HomepageTab } from '@/components/admin/HomepageTab';
import { MenuTab } from '@/components/admin/MenuTab';
import { OverviewTab } from '@/components/admin/OverviewTab';
import { Btn, Field } from '@/components/admin/ui';
import { auth } from '@/lib/firebase';
import { colors, font, radius, shadow } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'homepage', label: 'Homepage' },
  { key: 'menu', label: 'Menu Items' },
  { key: 'blog', label: 'Blog' },
  { key: 'analytics', label: 'Analytics' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export default function Admin() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setReady(true);
      }),
    [],
  );

  if (!ready) {
    return (
      <View style={[st.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      {user ? <Dashboard bottom={insets.bottom} /> : <Login />}
    </View>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!email.trim() || !pass) return setErr('Enter email and password.');
    setBusy(true);
    setErr('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e: any) {
      setErr(e.message || 'Login failed. Check credentials.');
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable style={st.close} onPress={() => router.back()} hitSlop={10}>
        <Ionicons name="close" size={22} color={colors.ink} />
      </Pressable>
      <ScrollView contentContainerStyle={st.loginWrap} keyboardShouldPersistTaps="handled">
        <Text style={st.logo}>Isebe</Text>
        <Text style={st.tagline}>Admin — Content Management</Text>
        <View style={st.loginCard}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="admin@isebe.ng"
          />
          <View>
            <Field
              label="Password"
              value={pass}
              onChangeText={setPass}
              secureTextEntry={!show}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="••••••••"
              onSubmitEditing={submit}
              style={{ paddingRight: 64 }}
            />
            <Pressable style={st.show} onPress={() => setShow((v) => !v)} hitSlop={8}>
              <Text style={st.showText}>{show ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>
          <Btn title="Sign in" variant="brand" busy={busy} onPress={submit} />
          {!!err && <Text style={st.err}>{err}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Dashboard({ bottom }: { bottom: number }) {
  const [tab, setTab] = useState<TabKey>('overview');
  return (
    <View style={{ flex: 1 }}>
      <View style={st.topbar}>
        <View>
          <Text style={st.topTitle}>Isebe Admin</Text>
          <View style={st.rt}>
            <View style={st.rtDot} />
            <Text style={st.rtText}>Real-time active</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable style={st.logout} onPress={() => signOut(auth)}>
            <Ionicons name="log-out-outline" size={15} color={colors.inkMid} />
            <Text style={st.logoutText}>Logout</Text>
          </Pressable>
          <Pressable style={st.closeInline} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="close" size={20} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.tabs}>
          {TABS.map((t) => (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={[st.tab, tab === t.key && st.tabOn]}>
              <Text style={[st.tabText, tab === t.key && { color: '#fff' }]}>{t.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 + bottom }}
          keyboardShouldPersistTaps="handled"
        >
          {tab === 'overview' && <OverviewTab goMenu={() => setTab('menu')} />}
          {tab === 'homepage' && <HomepageTab />}
          {tab === 'menu' && <MenuTab />}
          {tab === 'blog' && <BlogTab />}
          {tab === 'analytics' && <AnalyticsTab />}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  close: { position: 'absolute', top: 12, right: 16, zIndex: 5, width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  closeInline: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  loginWrap: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontFamily: font.extra, fontSize: 28, letterSpacing: -1, color: colors.brand },
  tagline: { fontFamily: font.regular, fontSize: 13, color: colors.inkMid, marginBottom: 20 },
  loginCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 18, ...shadow.card },
  show: { position: 'absolute', right: 14, top: 33 },
  showText: { fontFamily: font.semi, fontSize: 13, color: colors.brand },
  err: { fontFamily: font.regular, fontSize: 12, color: colors.danger, marginTop: 10 },

  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  topTitle: { fontFamily: font.extra, fontSize: 17, color: colors.ink },
  rt: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  rtDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  rtText: { fontFamily: font.medium, fontSize: 10, color: colors.success },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  logoutText: { fontFamily: font.semi, fontSize: 12, color: colors.inkMid },
  tabs: { paddingHorizontal: 20, gap: 8, paddingBottom: 6 },
  tab: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.full, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border },
  tabOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  tabText: { fontFamily: font.semi, fontSize: 13, color: colors.ink },
});
