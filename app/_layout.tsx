import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { ToastProvider } from '@/components/ui/toast';
import { colors } from '@/lib/theme';

function Guarda() {
  const { usuario, carregando } = useAuth();
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    const naAuth = segmentos[0] === '(auth)';
    if (!usuario && !naAuth) router.replace('/login');
    else if (usuario && naAuth) router.replace('/');
  }, [usuario, carregando, segmentos, router]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {carregando && (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <Guarda />
      </ToastProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  carregando: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
