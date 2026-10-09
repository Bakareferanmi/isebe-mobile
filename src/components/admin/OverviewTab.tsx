import { useData } from '@/context/DataContext';
import { colors } from '@/lib/theme';
import { useState } from 'react';
import { View } from 'react-native';
import { Btn, SecTitle, StatCard } from './ui';

export function OverviewTab({ goMenu }: { goMenu: () => void }) {
  const { menu, featured } = useData();
  const [updated] = useState(() =>
    new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }),
  );
  return (
    <View>
      <SecTitle title="Dashboard" sub="Quick snapshot of your content" />
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <StatCard num={menu.length} label="Menu items" />
        <StatCard num={featured.length} label="Featured items" />
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <StatCard num={updated} label="Last content update" small />
      </View>
      <Btn title="Add menu item" icon="add" variant="brand" onPress={goMenu} />
    </View>
  );
}
