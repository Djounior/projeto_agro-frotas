import { Stack } from 'expo-router';
import { colors } from '@/lib/theme';

export default function ManutencaoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="cadastro" options={{ title: 'Nova manutenção' }} />
    </Stack>
  );
}
