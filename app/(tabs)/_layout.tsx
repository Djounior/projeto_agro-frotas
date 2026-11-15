import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { BarraLateral, BarraLateralProps } from '@/components/barra-lateral';
import { HeaderUsuario } from '@/components/header-usuario';
import { useAuth } from '@/context/auth-context';
import { useLayout } from '@/lib/plataforma';
import { colors } from '@/lib/theme';

type NomeIcone = keyof typeof Ionicons.glyphMap;

/** Cria o ícone da aba. O `as never` evita o conflito de tipos entre versões. */
const icone = (nome: NomeIcone) =>
  (({ color, size }: { color: string; size: number }) => (
    <Ionicons name={nome} size={size} color={color} />
  )) as never;

export default function TabsLayout() {
  const { sair } = useAuth();
  const { largo } = useLayout();

  return (
    <Tabs
      tabBar={
        largo ? (props) => <BarraLateral {...(props as unknown as BarraLateralProps)} /> : undefined
      }
      screenOptions={{
        tabBarPosition: largo ? 'left' : 'bottom',
        tabBarStyle: { backgroundColor: colors.primary, borderTopWidth: 0 },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#B9D0BF',
        tabBarLabelStyle: { fontWeight: '600' },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel',
          tabBarIcon: icone('speedometer'),
          headerLeft: () => <HeaderUsuario />,
          headerRight: () => (
            <Pressable onPress={sair} hitSlop={10} style={{ marginRight: 16 }}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="maquinas"
        options={{ title: 'Máquinas', headerShown: false, tabBarIcon: icone('construct') }}
      />
      <Tabs.Screen
        name="manutencao"
        options={{ title: 'Manutenção', headerShown: false, tabBarIcon: icone('build') }}
      />
    </Tabs>
  );
}