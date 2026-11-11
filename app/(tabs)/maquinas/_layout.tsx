import { Stack } from 'expo-router';
import { colors } from '@/lib/theme';

export default function MaquinasLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Máquinas' }} />
      <Stack.Screen name="cadastro" options={{ title: 'Cadastro de máquina' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhes da máquina' }} />
    </Stack>
  );
}
