import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { useLayout } from '@/lib/plataforma';

export function HeaderUsuario() {
  const { usuario } = useAuth();
  const { largo } = useLayout();

  if (!usuario) return null;

  return (
    <View style={styles.caixa}>
      <Ionicons name="person-circle-outline" size={26} color="#fff" />
      {largo && (
        <Text style={styles.texto} numberOfLines={1}>
          {usuario.email}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 16, maxWidth: 260 },
  texto: { color: '#fff', fontWeight: '600', fontSize: 14 },
});