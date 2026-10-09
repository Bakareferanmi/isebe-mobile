import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, increment, serverTimestamp, setDoc } from 'firebase/firestore';
import { AppState } from 'react-native';
import { db } from './firebase';
import { todayKey } from './format';

// Same Firestore schema as the web app, so the admin analytics tab keeps working.
// Aggregated per-day to keep reads/writes cheap.

function bump(fields: Record<string, number>) {
  try {
    const update: Record<string, any> = {};
    Object.keys(fields).forEach((k) => (update[k] = increment(fields[k])));
    setDoc(doc(db, 'analytics_daily', todayKey()), update, { merge: true }).catch(() => {});
  } catch {}
}

export async function trackVisit() {
  try {
    const existing = await AsyncStorage.getItem('isebe_visitor_id');
    const isNew = !existing;
    if (isNew) {
      await AsyncStorage.setItem(
        'isebe_visitor_id',
        'v_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      );
    }
    bump({
      visits: 1,
      [isNew ? 'newVisitors' : 'returningVisitors']: 1,
      device_mobile: 1,
    });
  } catch {}
}

export function trackAddToCart(name: string) {
  bump({ addToCart: 1 });
  try {
    if (!name) return;
    const id =
      name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 80) || 'item';
    setDoc(
      doc(db, 'analytics_items', id),
      { name, addCount: increment(1), last_added: serverTimestamp() },
      { merge: true },
    ).catch(() => {});
  } catch {}
}

export const trackCartOpened = () => bump({ cartOpened: 1 });
export const trackCheckoutStarted = () => bump({ checkoutStarted: 1 });

// Time on app: log a session each time the app goes to the background
let sessionStart = Date.now();
let listening = false;
export function startTimeTracking() {
  if (listening) return;
  listening = true;
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      sessionStart = Date.now();
    } else {
      const seconds = Math.max(1, Math.round((Date.now() - sessionStart) / 1000));
      if (seconds <= 3600) bump({ totalTimeSeconds: seconds, timedSessions: 1 });
    }
  });
}
