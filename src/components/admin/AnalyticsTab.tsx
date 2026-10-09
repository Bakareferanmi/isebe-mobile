import { db } from '@/lib/firebase';
import { fmtDuration, todayKey } from '@/lib/format';
import { colors, font, radius } from '@/lib/theme';
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SecTitle, StatCard } from './ui';

type Day = { date: Date; [k: string]: any };
const sum = (arr: Day[], field: string) => arr.reduce((t, d) => t + (d[field] || 0), 0);
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

export function AnalyticsTab() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [items, setItems] = useState<{ name: string; addCount?: number }[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list: Date[] = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        list.push(d);
      }
      try {
        const snaps = await Promise.all(list.map((d) => getDoc(doc(db, 'analytics_daily', todayKey(d)))));
        if (!cancelled) setDays(snaps.map((sn, i) => ({ date: list[i], ...(sn.exists() ? sn.data() : {}) })));
      } catch {
        if (!cancelled) setDays(list.map((d) => ({ date: d })));
      }
      try {
        const snap = await getDocs(query(collection(db, 'analytics_items'), orderBy('addCount', 'desc'), limit(8)));
        if (!cancelled) setItems(snap.docs.map((d) => d.data() as any));
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!days) return <Text style={st.muted}>Loading…</Text>;

  const last7 = days.slice(-7);
  const last14 = days.slice(-14);
  const maxVisits = Math.max(1, ...last14.map((d) => d.visits || 0));
  const timed = sum(days, 'timedSessions');
  const visits = sum(days, 'visits');
  const added = sum(days, 'addToCart');
  const checkouts = sum(days, 'checkoutStarted');
  const steps = [
    { label: 'Visited app', count: visits, p: 100 },
    { label: 'Added item to cart', count: added, p: pct(added, visits) },
    { label: 'Started checkout', count: checkouts, p: pct(checkouts, visits) },
  ];
  const dm = sum(days, 'device_mobile');
  const dt = sum(days, 'device_tablet');
  const dd = sum(days, 'device_desktop');
  const dTotal = Math.max(1, dm + dt + dd);

  return (
    <View>
      <SecTitle title="Analytics" sub="How people are finding and using your app and site" />
      <View style={st.row}>
        <StatCard num={sum(days.slice(-1), 'visits')} label="Visits today" />
        <StatCard num={sum(last7, 'visits')} label="Visits (7 days)" />
      </View>
      <View style={st.row}>
        <StatCard num={visits} label="Visits (30 days)" />
        <StatCard num={fmtDuration(timed ? sum(days, 'totalTimeSeconds') / timed : 0)} label="Avg. session time" />
      </View>

      <View style={st.card}>
        <Text style={st.cardTitle}>Visits — last 14 days</Text>
        <View style={st.trend}>
          {last14.map((d, i) => (
            <View key={i} style={st.barWrap}>
              <View style={[st.bar, { height: `${Math.max(2, Math.round(((d.visits || 0) / maxVisits) * 100))}%` }]} />
            </View>
          ))}
        </View>
        <View style={st.labels}>
          <Text style={st.label}>{last14[0].date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</Text>
          <Text style={st.label}>{last14[13].date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</Text>
        </View>
      </View>

      <View style={st.card}>
        <Text style={st.cardTitle}>Visitor journey (last 30 days)</Text>
        {steps.map((step, i) => (
          <View key={step.label} style={{ marginBottom: 12 }}>
            <View style={st.between}>
              <Text style={st.stepLabel}>{step.label}</Text>
              <Text style={st.stepMeta}>{step.count} · {step.p}%</Text>
            </View>
            <View style={st.track}><View style={[st.fill, { width: `${step.p}%` }]} /></View>
            {i > 0 && <Text style={st.drop}>{steps[i - 1].count - step.count} dropped off before this step</Text>}
          </View>
        ))}
      </View>

      <View style={st.card}>
        <Text style={st.cardTitle}>Devices (last 30 days)</Text>
        {dm + dt + dd === 0 ? (
          <Text style={st.muted}>No data yet</Text>
        ) : (
          [['Mobile', dm], ['Tablet', dt], ['Desktop', dd]].map(([label, n]) => (
            <View key={label as string} style={st.devRow}>
              <Text style={st.devLabel}>{label}</Text>
              <View style={[st.track, { flex: 1 }]}>
                <View style={[st.fill, { width: `${Math.round(((n as number) / dTotal) * 100)}%` }]} />
              </View>
              <Text style={st.devPct}>{Math.round(((n as number) / dTotal) * 100)}%</Text>
            </View>
          ))
        )}
      </View>

      <View style={st.card}>
        <Text style={st.cardTitle}>Most added to cart</Text>
        {items === null ? (
          <Text style={st.muted}>Loading…</Text>
        ) : items.length === 0 ? (
          <Text style={st.muted}>No items added to cart yet</Text>
        ) : (
          items.map((it) => (
            <View key={it.name} style={[st.between, { paddingVertical: 6 }]}>
              <Text style={st.stepLabel} numberOfLines={1}>{it.name}</Text>
              <Text style={st.stepMeta}>{it.addCount || 0}×</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  muted: { fontFamily: font.regular, fontSize: 13, color: colors.inkLight },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  cardTitle: { fontFamily: font.bold, fontSize: 14, color: colors.ink, marginBottom: 12 },
  trend: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 4 },
  barWrap: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { backgroundColor: colors.brand, borderRadius: 4, width: '100%' },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  label: { fontFamily: font.regular, fontSize: 10, color: colors.inkLight },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  stepLabel: { fontFamily: font.medium, fontSize: 13, color: colors.ink, flexShrink: 1 },
  stepMeta: { fontFamily: font.semi, fontSize: 12, color: colors.inkMid },
  track: { height: 8, backgroundColor: colors.surface2, borderRadius: 4, overflow: 'hidden', marginTop: 6 },
  fill: { height: '100%', backgroundColor: colors.brand, borderRadius: 4 },
  drop: { fontFamily: font.regular, fontSize: 11, color: colors.inkLight, marginTop: 4 },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  devLabel: { fontFamily: font.medium, fontSize: 13, color: colors.ink, width: 64 },
  devPct: { fontFamily: font.semi, fontSize: 12, color: colors.inkMid, width: 38, textAlign: 'right' },
});
