import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { colors } from '@/lib/theme';

export default function TabsLayout() {
  const { sair } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
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
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer" size={size} color={color} />,
          headerRight: () => (
            <Pressable onPress={sair} hitSlop={10} style={{ marginRight: 16 }}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="maquinas"
        options={{
          title: 'Máquinas',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="construct" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manutencao"
        options={{
          title: 'Manutenção',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="build" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
